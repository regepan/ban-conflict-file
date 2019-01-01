#!/usr/bin/env node
"use strict";

const fs = require('fs');
const readline = require('readline');
const sgf = require('staged-git-files');
const symbols = require("log-symbols");

const black   = '\u001b[30m';
const red     = '\u001b[31m';
const green   = '\u001b[32m';
const yellow  = '\u001b[33m';
const blue    = '\u001b[34m';
const magenta = '\u001b[35m';
const cyan    = '\u001b[36m';
const white   = '\u001b[37m';

const reset   = '\u001b[0m';

/*
 * 
 * 
 ---------------------------------------- */
sgf('ACMR', (err, files) => {
  if (err) {
    console.error(err);
  }

  files.forEach((file) => {
    let line = 0;

    const rl = readline.createInterface({
      input: fs.createReadStream(file.filename),
      output: null,
      terminal: false
    });

    rl.on('line', function (data) {
      line++;

      if (data.search('^<<<<<<< HEAD$') > -1 || data.search('^=======$') > -1 || data.search('^>>>>>>>') > -1) {
        putError(line, file);
      }

    });

    rl.on('close', function() {
      process.exit(1);
    });
  });
});

/*
 * 
 * 
 ---------------------------------------- */
const putError = function (line, file) {
  console.error('\n ' + symbols['error'], magenta + `${file.filename} Line: ${line} is conflicted. Please fix conflict before create commit.` + reset + '\n');

  process.exit(1);
};

module.exports.putError = putError;
