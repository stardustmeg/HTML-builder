const fsPromises = require('node:fs/promises');
const path = require('node:path');
const os = require('node:os');

(async () => {
  try {
    const projectDistDir = path.join(__dirname, 'project-dist');
    const templateFilePath = path.join(__dirname, 'template.html');
    const HtmlFilePath = path.join(projectDistDir, 'index.html');
    const componentsDirPath = path.join(__dirname, 'components');
    const stylesDirPath = path.join(__dirname, 'styles');
    const assetsDirPath = path.join(__dirname, 'assets');
    const assetsCopyDirPath = path.join(projectDistDir, 'assets');

    let templateContent = await fsPromises.readFile(templateFilePath, 'utf-8');

    const templateTags = templateContent.match(/{{(.*?)}}/g);

    if (templateTags) {
      for (const tag of templateTags) {
        const componentName = tag.slice(2, -2).trim();
        const componentFilePath = path.join(
          componentsDirPath,
          `${componentName}.html`,
        );
        const componentContent = await fsPromises.readFile(
          componentFilePath,
          'utf-8',
        );
        templateContent = templateContent.replace(tag, componentContent);
      }
    }

    await fsPromises.mkdir(projectDistDir, { recursive: true });
    await fsPromises.writeFile(HtmlFilePath, templateContent);

    await mergeStyles(stylesDirPath, projectDistDir);

    await fsPromises.rm(assetsCopyDirPath, { recursive: true, force: true });
    await fsPromises.mkdir(assetsCopyDirPath, { recursive: true });
    await copyDirectory(assetsDirPath, assetsCopyDirPath);

    console.log('Done!');
  } catch (err) {
    console.error(`Something went wrong! ${err.message}`);
  }
})();

async function mergeStyles(stylesDirPath, bundleDirPath) {
  const bundleFilePath = path.join(bundleDirPath, 'style.css');

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
    console.error(`Something went wrong with merging styles! ${err.message}`);
  }
}

async function copyDirectory(src, destination) {
  try {
    const files = await fsPromises.readdir(src, { withFileTypes: true });

    await Promise.all(
      files.map(async (file) => {
        const sourcePath = path.join(src, file.name);
        const destinationPath = path.join(destination, file.name);

        if (file.isDirectory()) {
          await fsPromises.mkdir(destinationPath, { recursive: true });
          await copyDirectory(sourcePath, destinationPath);
        } else {
          await fsPromises.copyFile(sourcePath, destinationPath);
        }
      }),
    );
  } catch (err) {
    console.error(`Something went wrong with merging styles! ${err.message}`);
  }
}
