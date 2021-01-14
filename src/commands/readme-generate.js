const fs = require('fs');
const MarkDownAddonMetadataRenderer = require('../renderer/MarkDownAddonMetadataRenderer');
const extractMetadata = require('../addon/extractMetadata');

function readmeGenerate(pwd, destinationFile) {

    const addonMetadata = extractMetadata(pwd);

    const renderer = new MarkDownAddonMetadataRenderer();

    fs.writeFileSync(destinationFile, renderer.render(addonMetadata));

    return 0;
}

module.exports = readmeGenerate;