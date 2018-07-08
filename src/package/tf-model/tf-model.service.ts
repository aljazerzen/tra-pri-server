import { HttpException, Injectable } from '@nestjs/common';
import { createHttpExceptionBody } from '@nestjs/common/utils/http-exception-body.util';
import { spawn } from 'child_process';
import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import * as rimraf from 'rimraf';

import { FILE_TYPE } from '../../file/file.constants';
import { FileService } from '../../file/file.service';
import { Label } from '../../wine/label.entity';
import { WineService } from '../../wine/wine.service';

@Injectable()
export class TFModelService {

  constructor(
    private fileService: FileService,
    private wineService: WineService,
  ) {
  }

  generating = false;

  pad(number: number) {
    return ('0'.repeat(5) + number).substr(-5);
  }

  labelName(labelNumber: number, label: Label) {
    return this.pad(labelNumber) + path.extname(label.image.path)
  }

  start() {
    if (this.generating)
      throw new HttpException(createHttpExceptionBody('generation already in progress', 'GENERATION_IN_PROGRESS', 400), 400);
    this.generate();
  }

  private async generate() {
    this.generating = true;

    const log = fs.createWriteStream(process.env.ML_DATA_PATH + '/log.txt', 'utf-8');

    // get all wines
    const wines = await this.wineService.list(['labels', 'labels.image']);

    log.write('...setting up label image symlink directory structure\n');

    // create fresh data dir
    await new Promise(resolve =>
      rimraf(process.env.ML_DATA_PATH, resolve)
    );
    await new Promise(resolve =>
      fs.mkdir(process.env.ML_DATA_PATH, resolve)
    );

    // create sym links to image files for each label
    const classes = [];
    for (let wine of wines) {

      if (wine.labels.length > 0 && wine.labels.find(l => l.index === 0)) {

        await new Promise(resolve =>
          fs.mkdir(process.env.ML_DATA_PATH + '/' + wine.id, resolve)
        );

        let labelNumber = 1;
        for (let label of wine.labels) {
          if (label) {
            let labelFilename = process.env.ML_DATA_PATH + '/' + wine.id + '/' + this.labelName(labelNumber++, label);

            await this.fileService.createSymLink(label.image, labelFilename);

            if (label.index === 0) {
              classes.push({
                folder: '' + wine.id,
                labelFilename,
                labelCoordinates: label.coordinates
              });
            }
          }
        }
      }
    }

    // prepare JSON file
    log.write('...preparing JSON config file\n')

    const config = {
      config: {
        path: process.env.ML_DATA_PATH,
        training_batch_size: +process.env.ML_TRAINING_BATCH_SIZE,
        number_of_epochs: +process.env.ML_NUMBER_OF_EPOCHS,
        learning_rate: +process.env.ML_LEARNING_RATE,
      },
      classes
    };

    const configJSON = JSON.stringify(config, null, 2);

    await new Promise((resolve, reject) =>
      fs.writeFile(process.env.ML_SCRIPT_PATH + '/config.json', configJSON, err => err ? reject(err) : resolve())
    );
    log.write(configJSON + '\n');

    log.write('...starting \'generate_model.py\'\n')

    // enable python venv and run generate_model.py script
    const childProcess = spawn(`source ${process.env.ML_PYTHON_VENV_PATH}/bin/activate && python3 generate_model.py`, [], {
      shell: 'bash',
      cwd: process.env.ML_SCRIPT_PATH
    });

    childProcess.stdout.on('data', data => log.write(data));
    childProcess.stderr.on('data', data => log.write(data.toString().split('\n').map(s => '###' + s).join('\n')));

    // wait for finish
    await new Promise(resolve =>
      childProcess.on('close', () => {
        log.write(`\n...script exited\n`)
        resolve();
      })
    );

    // import model file in the file database
    try {
      const modelPath = process.env.ML_DATA_PATH + '/model.pb';

      await new Promise((resolve, reject) => fs.stat(modelPath, err => err ? reject(err) : resolve()));

      await this.fileService.importLocalFile(FILE_TYPE.MODEL, modelPath, new Date().toISOString().split('.')[0] + '.pb');

      log.write(`\n...model.pb imported into file database\n`)
    } catch (e) {
      // script failed - model.pb does not exist
      log.write(`\n...model.pb does not exist - not imported\n`)
    }

    log.write(`\n...finished\n`)
    log.end();
    this.generating = false;
  }

  async attach(res: Response) {
    res.sendFile(process.env.ML_DATA_PATH + '/log.txt', (err) => {
      if(err)
        res.send('No logs');
    });
  }

}