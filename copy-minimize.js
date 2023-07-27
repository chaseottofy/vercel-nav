const fs = require('fs');
const path = require('path');
const minifyHTML = require('html-minifier').minify;
const postcss = require('postcss');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');
// const { optimize } = require('svgo');

function minifyAndCopyFile(filePath, destinationPath, type = 'txt') {
  const fileContent = fs.readFileSync(path.join(__dirname, filePath), 'utf8');

  switch (type) {
    case 'html':
      const minifiedHTML = minifyHTML(fileContent, {
        removeAttributeQuotes: true,
        collapseWhitespace: true,
        removeComments: true
      });
      fs.writeFileSync(path.join(__dirname, destinationPath), minifiedHTML);
      break;

    case 'css':
      postcss([autoprefixer, cssnano])
        .process(fileContent, { from: 'undefined' })
        .then(result => {
          fs.writeFileSync(path.join(__dirname, destinationPath), result.css);
        });
      break;

    case 'font':
      fs.copyFileSync(path.join(__dirname, filePath), path.join(__dirname, destinationPath));
      break;

    case 'img':
      fs.copyFileSync(path.join(__dirname, filePath), path.join(__dirname, destinationPath));
      break;

    case 'svg':
      // const result = optimize(fileContent, {
      //   path: filePath,
      //   multipass: true,
      // })
      // const optimizedSVG = result.data;
      // fs.writeFileSync(path.join(__dirname, destinationPath), optimizedSVG);
      fs.copyFileSync(path.join(__dirname, filePath), path.join(__dirname, destinationPath));
      break;

    default:
      fs.copyFileSync(path.join(__dirname, filePath), path.join(__dirname, destinationPath));
  }
}

minifyAndCopyFile('./src/index.html', './dist/index.html', 'html');
minifyAndCopyFile('./src/styles.css', './dist/styles.css', 'css');
minifyAndCopyFile('./src/favicon-32x32.png', './dist/favicon-32x32.png', 'img');
minifyAndCopyFile('./src/rings-bg.svg', './dist/rings-bg.svg', 'svg');
minifyAndCopyFile('./src/inter-v12-latin-500.woff2', './dist/inter-v12-latin-500.woff2', 'font');
minifyAndCopyFile('./src/inter-v12-latin-700.woff2', './dist/inter-v12-latin-700.woff2', 'font');
minifyAndCopyFile('./src/inter-v12-latin-regular.woff2', './dist/inter-v12-latin-regular.woff2', 'font');