import path from 'path';

import ansiEscapes from 'ansi-escapes';
import { run } from '@jxa/run';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { oraPromise } from 'ora';
import boxen from 'boxen';
import chalk from 'chalk';

import { getPhotoCount } from './library.js';
import Exporter from './export.js';

const numberFormat = new Intl.NumberFormat();

const argv = yargs(hideBin(process.argv))
  .option('batch-size', {
    alias: 'b',
    type: 'number',
    description: 'Number of photos to export in each batch',
    default: 5
  })
  .option('prefix', {
    alias: 'p',
    type: 'string',
    description: 'Prefix to prepend to exported photos',
    default: 'export-'
  })
  .option('start', {
    alias: 's',
    type: 'number',
    description: 'Starting index for export',
    default: 0
  })
  .option('end', {
    alias: 'e',
    type: 'number',
    description: 'Ending index for export'
  })
  .option('outputDir', {
    alias: 'd',
    type: 'string',
    description: 'Target directory for the exported files'
  })
 .argv;

const { 
  batchSize,
  prefix,
  start,
  end,
  outputDir
} = argv;
 
process.stdout.write(ansiEscapes.clearScreen);

console.log(boxen([
  chalk.cyanBright('Photos Batch Exporter'), 
  '',
  `- batch size: ${chalk.bold(batchSize)}`
 ].join('\n'), { 
   padding: 1, 
   margin: 1,
   borderStyle: 'double',
   dimBorder: true
}));

const totalCount = await oraPromise(getPhotoCount(), { 
  text: 'Reading Photos library',
  spinner: 'bouncingBar',
  successText: count => {
    return `Found ${chalk.yellowBright(numberFormat.format(count))} total items in your library.`
  }
});

const exporter = new Exporter(
  start,
  end || totalCount,
  batchSize,
  prefix,
  path.resolve(outputDir)
);

await exporter.export();
