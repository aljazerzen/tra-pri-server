import { HttpException, Injectable } from '@nestjs/common';
import { createHttpExceptionBody } from '@nestjs/common/utils/http-exception-body.util';
import { ChildProcess, spawn } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as rimraf from 'rimraf';
import { Transform, Writable } from 'stream';

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
  childProcess: ChildProcess;
  bus: Transform = new Transform({
    transform(data, encodeing, callback) {
      this.push(data);
      callback();
    }
  });

  pad(number: number) {
    return ('0'.repeat(5) + number).substr(-5);
  }

  labelName(labelNumber: number, label: Label) {
    return this.pad(labelNumber) + path.extname(label.image.path)
  }

  async generate() {
    if(this.generating)
      throw new HttpException(createHttpExceptionBody('generation already in progress', 'GENERATION_IN_PROGRESS', 400), 400);
    this.generating = true;

    // get all wines
    const wines = await this.wineService.list(['labels', 'labels.image']);

    this.bus.write('...setting up label image symlink directory structure\n');

    // create fresh data dir
    await new Promise(resolve =>
      rimraf(process.env.ML_DATA_PATH, resolve)
    );
    await new Promise(resolve =>
      fs.mkdir(process.env.ML_DATA_PATH, resolve)
    );

    // create sym links to image files for each label
    const classes = [];
    let classNumber = 1;
    for (let wine of wines) {

      await new Promise(resolve =>
        fs.mkdir(process.env.ML_DATA_PATH + '/' + classNumber, resolve)
      );

      let labelNumber = 1;
      for (let label of wine.labels) {
        if (label) {
          let labelFilename = process.env.ML_DATA_PATH + '/' + classNumber + '/' + this.labelName(labelNumber++, label);

          await this.fileService.createSymLink(label.image, labelFilename);

          if (label.index === 0) {
            classes.push({
              folder: '' + classNumber,
              labelFilename,
              labelCoordinates: label.coordinates
            });
          }
        }
      }

      classNumber++;
    }

    // prepare JSON file
    this.bus.write('...preparing JSON config file\n')

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
    this.bus.write(configJSON + '\n');

    this.bus.write('...starting \'generate_model.py\'\n')

    // enable python venv and run generate_model.py script
    this.childProcess = spawn(`source ${process.env.ML_PYTHON_VENV_PATH}/bin/activate && python3 generate_model.py`, [], { 
      shell: 'bash',
      cwd: process.env.ML_SCRIPT_PATH
    });

    this.childProcess.stdout.pipe(this.bus, { end: false });
    this.childProcess.stderr.on('data', data => this.bus.write(data.toString().split('\n').map(s => '###' + s).join('\n')));

    // wait for finish
    await new Promise(resolve =>
      this.childProcess.on('close', () => {
        this.bus.write(`\n...script exited\n`)
        resolve();
      })
    );
    this.childProcess = null;

    this.generating = false;
  }

  async stop() {
    if(this.childProcess) {
      this.childProcess.kill('SIGKILL');
    }
  }

  async attach(output: Writable) {
    this.bus.pipe(output);
  }

}