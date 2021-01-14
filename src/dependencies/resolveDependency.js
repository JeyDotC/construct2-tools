const https = require('https');
const jsdom = require('jsdom');

const {JSDOM} = jsdom;

const baseUrl = 'https://www.construct.net/en/construct-2/addons';

function resolveDependency(dependecyName, category = undefined) {

    const options = {
        sort: 2,
        c: category,
        hb: 1,
        ho: 1,
        hd: 0,
        q: dependecyName,
        sc: 'Addons.4',
    };

    const encodedOptions = Object.entries(options)
        .filter(([, value]) => value !== undefined)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');

    https.get(`${baseUrl}?${encodedOptions}`, res => {
        console.log('statusCode:', res.statusCode);
        console.log('headers:', res.headers);

        let body = '';

        res.on('data', (d) => {
            body += d;
        }).on('end', () => {
            const {document} = (new JSDOM(body)).window;
            const foundEntries = document.querySelectorAll('.addonRender .name');
            console.log(`Found ${foundEntries.length} results`);
            foundEntries.forEach(e => console.log(e));
        });
    }).on('error', (e) => {
        console.error(e);
    });
}

module.exports = resolveDependency;