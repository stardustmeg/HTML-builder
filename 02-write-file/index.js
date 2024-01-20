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
  console.log(`${os.EOL}Bye bye!`);
  process.exit(0);
};

(function ask() {
  rl.question('Tell me what you want to say >> ', (answer) => {
    if (answer.toLowerCase() === 'exit') {
      bye();
    }
    output.write(`${answer}${os.EOL}`, (err) => {
      if (err) {
        console.error(`Something went wrong! ${err}`);
      }
      ask();
    });
  });
})();

rl.on('close', bye);
