#!/usr/bin/env node

const readmeGenerate = require('../commands/readme-generate');

const argv = require('yargs')
    .command('readme-generate [destFile]', 'Generates a readme file', yargs => {
        yargs.positional('destFile', {
            describe: 'Destination file, relative to this PWD',
            default: './README.md',
        });
        yargs.option('source', {
            alias: 's',
            describe: 'The location of the add-on sources folder. Defaults to current working directory.'
        })
    }, argv => {
        const relativeDestinationFile = argv.destFile;
        const relativeSourceFolder = argv.source;
        const pwd = process.env.PWD;

        const absoluteSourcesLocation = relativeSourceFolder !== undefined ? toFullLocation(pwd, relativeSourceFolder) : pwd;
        const absoluteDestinationFile = toFullLocation(pwd, relativeDestinationFile);

        readmeGenerate(absoluteSourcesLocation, absoluteDestinationFile);
    }).argv;

function toFullLocation(pwd, fileName) {
    return fileName.startsWith('/') ? fileName : `${pwd}/${fileName}`;
}