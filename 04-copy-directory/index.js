const path = require('node:path');
const fsPromises = require('node:fs/promises');

const folderPath = path.join(__dirname, 'files');
const folderPathCopy = path.join(__dirname, 'files-copy');

(async function copyDir() {
  try {
    await fsPromises.rm(folderPathCopy, { recursive: true, force: true });
    await fsPromises.mkdir(folderPathCopy, { recursive: true });

    const files = await fsPromises.readdir(folderPath, { withFileTypes: true });

    await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(folderPath, file.name);
        const filePathCopy = path.join(folderPathCopy, file.name);
        await fsPromises.copyFile(filePath, filePathCopy);
      }),
    );
  } catch (err) {
    console.error(`Something went wrong! ${err.message}`);
  }
})();
