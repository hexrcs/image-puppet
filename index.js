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

// Expected App Behavior
//
// 1. no arguments to return help, same as "-h, --help"
//
// 2. option "-i, --interactive" to launch interactive mode, like below
//
// $ image-puppet -i
// Image Puppet v0.0.1 (Interactive mode)
// ? Keywords to use in search: big cats
// ? Name of image set (big-cats): cats
// ? Image set saving location (data): image
// ? Max image count (100): 200
// ? Convert or resize the images (no): yes
// ? Set max size, min size, or both (max): min
// ? Min width: 100
// ? Min height: 50
// ? What format (jpg): png
// Alright, here we go!
// Parsing search results...
// We only got 175 results back.
// Saving images to image/cats (75/175)...
// Downloading done in 30.5s!
//
// 3. other options
//
// $ image-puppet 
//    -s "big cats" 
//    -n cats 
//    -d image
//    -n 200
//    -w MIN_WIDTH
//    -W MAX_WIDTH
//    -h MIN_HEIGHT
//    -H MAX_HEIGHT
//    -f jpg
//

program.parse(process.argv)
