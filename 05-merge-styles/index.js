const path = require('node:path');
const fsPromises = require('node:fs/promises');
const os = require('node:os');

(async () => {
  const stylesDirPath = path.join(__dirname, 'styles');
  const bundleDirPath = path.join(__dirname, 'project-dist');
  const bundleFilePath = path.join(bundleDirPath, 'bundle.css');

  try {
    const files = await fsPromises.readdir(stylesDirPath, {
      withFileTypes: true,
    });

    const cssFiles = files.filter(
      (file) => file.isFile() && file.name.endsWith('.css'),
    );

    const cssContent = await Promise.all(
      cssFiles.map(async (file) => {
        const filePath = path.join(stylesDirPath, file.name);
        return fsPromises.readFile(filePath, 'utf-8');
      }),
    );

    await fsPromises.writeFile(bundleFilePath, cssContent.join(os.EOL));
  } catch (err) {
    console.error(`Something went wrong! ${err.message}`);
  }
})();
