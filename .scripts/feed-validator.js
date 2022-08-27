const { readFileSync } = require('fs');
const https = require('https');
const xml2js = require('xml2js');

// Read feed, parse it and build request body.
const feed = readFileSync('./_site/feed.xml', 'utf-8');
const xmlParser = new xml2js.Parser();
const xml = encodeURIComponent(feed);
const body = `manual=1&output=soap12&rawdata=${xml}`;

const options = {
  hostname: 'validator.w3.org',
  path: '/feed/check.cgi',
  method: 'POST',
  headers: {
    'Content-type': 'application/x-www-form-urlencoded'
  }
};

let response = '';

const request = https.request(options, (res) => {
  res
    .on('data', (chunk) => {
      response += chunk;
    })
    .on('end', () => {
      xmlParser.parseString(response, (_, result) => {
        // Parse RSS validator XML response, extract validity, parse it as boolean.
        const valid = JSON.parse(
          result['env:Envelope']['env:Body'][0]['m:feedvalidationresponse'][0][
            'm:validity'
          ][0]
        );
        if (valid) {
          console.log('Feed valid!');
          process.exit(0);
        } else {
          console.error('Feed invalid');
          process.exit(1);
        }
      });
    });
});

request.on('error', (error) => {
  console.error('Feed validation request failed');
  console.error(error);
  process.exit(1);
});

request.write(body);
request.end();
