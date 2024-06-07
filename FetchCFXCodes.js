const axios = require('axios');
const fs = require('fs');

const cfxCodePattern = /\u0006([a-z0-9]{6})/g;

function extractCfxCodes(data) {
    const matches = [];
    let match;
    while ((match = cfxCodePattern.exec(data)) !== null) {
        const code = match[1];
        if (code !== 'locale') {
            matches.push(code);
        }
    }
    return matches;
}

function writeCfxCodesToFile(cfxCodes) {
  const file = fs.createWriteStream('cfxCodes.txt');
  cfxCodes.forEach((cfxCode) => {
      file.write(`${cfxCode}\n`);
  });
  file.end();
  console.log('CFX Codes written to file.');
}

axios.get('https://servers-frontend.fivem.net/api/servers/streamRedir/').then((response) => {
  const data = response.data;
  const cfxCodes = extractCfxCodes(data);
  console.log('CFX Codes:', cfxCodes);

  writeCfxCodesToFile(cfxCodes);

}).catch((err) => {
  console.error('Error fetching data:', err);
});
