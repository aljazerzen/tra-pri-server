import { HttpException, Injectable } from '@nestjs/common';
import { createHttpExceptionBody } from '@nestjs/common/utils/http-exception-body.util';
import * as archiver from 'archiver';
import { spawn } from 'child_process';
import { Response } from 'express';
import * as fs from 'fs';
import { EOL } from 'os';
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

  async prepareModelInput() {

    // get all wines
    const wines = await this.wineService.list(['labels', 'labels.image']);;

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

  }

  zipModelInput(stream: Response) {

    const archive = archiver('zip', { zlib: { level: 9 } });

    // good practice to catch warnings (ie stat failures and other non-blocking errors)
    archive.on('warning', function (err) {
      if (err.code === 'ENOENT') {
        console.log(err);
      } else {
        // throw error
        throw err;
      }
    });

    // good practice to catch this error explicitly
    archive.on('error', function (err) {
      throw err;
    });

    // pipe archive data to the file

    archive.directory(process.env.ML_DATA_PATH, false);
    archive.file(process.env.ML_SCRIPT_PATH + '/config.json', { name: 'config.json' });

    archive.pipe(stream);

    archive.finalize();
  }

  async loadLabelMap(labelMapFile: Buffer) {

    const wines = await this.wineService.list();

    const labelMap = labelMapFile.toString().split(EOL).map(line => +line.trim());

    wines.forEach(w => w.classNumber = null);

    let winesMarked = 0;
    for (let classNumber = 0; classNumber < labelMap.length; classNumber++) {

      const wine = wines.find(w => w.id === labelMap[classNumber]);

      if (wine) {
        wine.classNumber = classNumber;
        winesMarked++;
      }
    }

    await this.wineService.saveAll(wines);
    return { winesMarked, labelMapLength: labelMap.length, allWines: wines.length }
  }

  private async generate() {
    this.generating = true;

    const log = fs.createWriteStream(process.env.ML_DATA_PATH + '/log.txt', 'utf-8');

    log.write('...setting up label image symlink directory structure\n');


    // log.write(configJSON + '\n');

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

      // check that it exist
      await new Promise((resolve, reject) => fs.stat(modelPath, err => err ? reject(err) : resolve()));

      await this.fileService.importLocalFile(FILE_TYPE.MODEL, modelPath, this.createModelFilename());

      log.write(`\n...model.pb imported into file database\n`)
    } catch (e) {
      // script failed - model.pb does not exist
      log.write(`\n...model.pb does not exist - not imported\n`)
    }

    // load label map
    const labelMapFile = await new Promise<Buffer>((resolve, reject) =>
      fs.readFile(process.env.ML_DATA_PATH + '/label_map.txt', (err, data) => err ? reject(err) : resolve(data))
    );
    this.loadLabelMap(labelMapFile);

    log.write(`\n...finished\n`)
    log.end();
    this.generating = false;
  }

  async attach(res: Response) {
    res.sendFile(process.env.ML_DATA_PATH + '/log.txt', (err) => {
      if (err)
        res.send('No logs');
    });
  }

  createModelFilename() {
    return new Date().toISOString().split('.')[0] + '.pb'
  }

}