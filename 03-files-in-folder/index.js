const path = require('node:path');
const fsPromises = require('node:fs/promises');
const { extname, basename } = require('node:path');

const folderPath = path.join(__dirname, 'secret-folder');

(async () => {
  try {
    const files = await fsPromises.readdir(folderPath);

    for (const file of files) {
      const filePath = path.join(folderPath, file);
      const stats = await fsPromises.stat(filePath);

      if (stats.isFile()) {
        const fileName = basename(file, extname(file));
        const fileExtension = file.split('.').pop();
        const fileSize = `${stats.size}B`;

        console.log(`${fileName} - ${fileExtension} - ${fileSize}`);
      }
    }
  } catch (err) {
    console.error(`Something went wrong! ${err.message}`);
  }
})();
