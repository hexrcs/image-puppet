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
