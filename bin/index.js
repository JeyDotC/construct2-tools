#!/usr/bin/env node

const readmeGenerate = require('../commands/readme-generate');

const argv = require('yargs')
    .command('readme-generate [destFile]', 'Generates a readme file', yargs => {
        yargs.positional('destFile', {
            describe: 'Destination file, relative to this PWD',
            default: './README.md',
        })
    }, argv => {
        const relativeDestinationFile = argv.destFile;
        const pwd = process.env.PWD;

        readmeGenerate(pwd, relativeDestinationFile);
    }).argv;