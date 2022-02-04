import chalk from 'chalk';
import { run } from '@jxa/run';
import ora, { oraPromise } from 'ora';
import ProgressBar from 'progress';
import boxen from 'boxen';

import { formatNumber } from './output.js';
import { getItems, doExport } from './library.js';

export default class Exporter {
  constructor(start, end, batchSize, prefix, outputDir) {
    this.start = start;
    this.end = end;
    this.batchSize = batchSize;
    this.prefix = prefix;
    this.outputDir = outputDir;

    this.batchNumber = 0;
    this.nextBatchStart = 0;
  }

  async export() {
    const total = this.end - this.start;

    const items = await oraPromise(getItems(this.start, this.end), {
      text: 'Retrieving items to export',
      spinner: 'bouncingBar'
    });

    console.log(`Ready to export ${formatNumber(items.length)} items to ${chalk.greenBright(this.outputDir)}`);
    console.log();

    let done = 0;
    let currentStart = this.start;
    let currentEnd = currentStart + this.batchSize;

    const spinner = ora({
      text: 'Exporting',
      spinner: 'bouncingBar'
    });
    spinner.start();
    
    while (currentStart < this.end) {
      await doExport(currentStart, currentEnd, this.outputDir);

      currentStart = currentEnd;
      currentEnd += this.batchSize;
      done += this.batchSize;

      const percent = Math.round((done / total) * 100);
      
      spinner.text = `Exported ${done}/${total} items (${percent}%)`;
    }

    // TODO: rename files

    spinner.succeed('Import complete!');
    console.log();
  }
}
