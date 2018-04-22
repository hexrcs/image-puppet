#!/usr/bin/env node

const program = require('commander')
const run = require('./google-images')

const defaultOptions = {
  searchKeyword: 'cats',
  downloadDir: 'data',
  datasetName: 'cats',
  maxCount: 100,
  maxWidth: 0,
  maxHeight: 0,
  minWidth: 0,
  minHeight: 0,
  convertTo: null
}

program
  .version('0.0.1')
  .description('A handy toolkit for preparing your own image datasets right from Google Images')

// no arguments to launch interactive mode
// program
//   .command()

program.parse(process.argv);
