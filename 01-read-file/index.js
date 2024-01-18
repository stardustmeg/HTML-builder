const path = require('node:path');
const fs = require('node:fs');

const srcPath = path.join(__dirname, 'text.txt');
const readStream = fs.createReadStream(srcPath);

readStream.on('error', (err) => {
  console.error(`Something went wrong! ${err}`);
});

readStream.on('data', (chunk) => {
  console.log(chunk.toString());
});
