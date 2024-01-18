const path = require('node:path');
const fs = require('node:fs');
const os = require('node:os');
const readline = require('node:readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const srcPath = path.join(__dirname, 'text.txt');

const output = fs.createWriteStream(srcPath);

const bye = () => {
  output.end();
  console.log(`${os.EOL}bye bye!`);
  process.exit(0);
};

const ask = () => {
  rl.question('Tell me what you want to say >> ', (answer) => {
    if (answer.toLowerCase() === 'exit') {
      bye();
    } else {
      output.write(`${answer}${os.EOL}`, (err) => {
        if (err) {
          console.error(`Something went wrong! ${err}`);
        } else {
          ask();
        }
      });
    }
  });
};

rl.on('close', () => {
  bye();
});

process.on('SIGINT', () => {
  bye();
});

ask();
