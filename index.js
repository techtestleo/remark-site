var unified = require('unified');
var vfile = require('to-vfile');
var report = require('vfile-reporter');
var markdown = require('remark-parse');
var slug = require('remark-slug');
var toc = require('remark-toc');
var remark2retext = require('remark-retext');
var english = require('retext-english');
var remark2rehype = require('remark-rehype');
var doc = require('rehype-document');
var html = require('rehype-stringify');
var retext = require('retext')
var emoji = require('retext-emoji');
var spacing = require('retext-sentence-spacing');
var spell = require('retext-spell');
var indefiniteArticle = require('retext-indefinite-article');
var repeated = require('retext-repeated-words')
var dictionary = require('dictionary-en-gb');
var urls = require('retext-syntax-urls');
var fs = require('fs');
var sass = require('node-sass');
const chalk = require('chalk');
chalk.level = 3;
// Chalk styles
const reading = chalk.yellow;
const writing = chalk.magenta;
const success = chalk.green;

// Load .env file
require('dotenv').config();

// Global process variables
const out_dir = process.env.build_directory || 'out';
const in_dir = process.env.inbound_md_directory || 'content';
const renderExtension = process.env.render_extension || '.html';
const scss_dir = process.env.inbound_scss_directory || 'scss';
const ignore = process.env.ignore_scss.split(',') || ['constants', 'index.css'];
const ignore_spelling = process.env.ignore_spellcheck.split(',') || [];
const ignore_dirs = process.env.ignore_directories.split(',') || [];
const ignore_ext = process.env.ignore_extensions.split(',') || [];

const make = (fileTheme, nestedPath) => {
  return processor = unified()
    // enable footnoes
    .use(markdown, { footnotes: true })
    .use(
      remark2retext,
      unified()
        .use(english)
        // check for repeated words words
        .use(repeated)
        // A -> An and vice versa
        .use(indefiniteArticle)
        // check for spacing      errors
        .use(spacing)
        // allow spellcheck to ignore links
        .use(urls)
        // check for spelling errors, ignoring the listed words
        .use(spell, { dictionary, ignore: ignore_spelling })
    )
    // ad id's to heading level elements
    .use(slug)
    // enable creating a table of linked headings in files that have a "Table of Contents" heading
    .use(toc)
    // convert to html syntax tree
    .use(remark2rehype)
    .use(doc, { css: `${nestedPath ? "../" : ''}${fileTheme ? fileTheme : 'index'}.css` })
    // convert to html
    .use(html)
}

/**
 * 
 * @param {string} singleFileName 
 * @param {string} dirPath 
 */
const doProcessing = (singleFileName, dirPath) => {
  // grab .theme from filename
  const fileTheme = singleFileName.split('.')[1];

  const validTheme = [fileTheme].filter(item => !ignore_ext.includes(item));

  console.log(validTheme)


  make(validTheme[0], dirPath).process(vfile.readSync(`${in_dir}${dirPath ? '/' + dirPath : ''}/${singleFileName}`), function (err, file) {
    if (err) { throw err; }
    // Log warnings
    console.warn(report(file));

    // set the directory
    file.dirname = out_dir + `${dirPath ? '/' + dirPath : ''}`;

    // name the file, discarding the .theme 
    const fileName = singleFileName.split('.')[0];
    file.basename = fileName;
    // set the extension
    file.extname = renderExtension;
    // convert shortcode emojis
    var convertedFile = retext()
      .use(emoji, { convert: 'encode' })
      .processSync(file);

    // write file
    vfile.writeSync(convertedFile)
  })
}

/**
 * Get all filenames in a directory
 * @param {string} directory directory to look in
 * @returns {Promise<string[]>} array of filenames in the directory
 */
const readFiles = (directory) => {
  return new Promise((resolve, reject) => {
    fs.readdir(directory, (err, fileNames) => {
      if (err) {
        reject(err);
      }
      resolve(fileNames);
    });
  });
}

/**
 * Render scss files to the out_dir directory.
 * @param {string[]} scss_fileNames array of filenames to render
 * @returns {Promise<void>} resolves when complete.
 */
const renderStylesheets = (scss_fileNames) => {
  return new Promise((resolve, reject) => {
    scss_fileNames.forEach((single_scss) => {
      const result = sass.renderSync({ file: `${scss_dir}/${single_scss}` });
      fs.writeFileSync(`${out_dir}/${single_scss.replace('.theme.scss', '.css')}`, result.css);
      console.log(writing(`wrote file: ${scss_dir}/${single_scss.replace('.scss', '.css')}`));
    });
    resolve();
  })
}

/**
 * Read the scss_dir, and render css files to the out_dir with renderStylesheets().
 */
const renderSass = () => {
  return new Promise((resolve, reject) => {
    readFiles(scss_dir).then((scss_fileNames) => {

      // remove directory name and processed files from render list
      scss_fileNames = scss_fileNames.filter(item => !ignore.includes(item));

      console.log(reading(`reading ${scss_fileNames.length} scss files`));

      renderStylesheets(scss_fileNames).then(() => {
        resolve();
      })
    });
  });
}

/**
 * 1. Render scss files in the scss_dir directory to css files in the out_dir directory.
 * 2. Render md files in the in_dir directory to html files in the out_dir directory.
 */
function main() {
  renderSass().then(() => {
    console.log(success('scss processing complete ✅'));
    readFiles(in_dir).then((fileNames) => {
      // iterate over each file name
      const dirNames = fileNames.filter(item => ignore_dirs.includes(item));
      fileNames = fileNames.filter(item => !ignore_dirs.includes(item));

      if (dirNames.length > 0) {
        subDirRender(dirNames).then(() => {
          doRender(fileNames);
        });
      }
      doRender(fileNames);
    });
  });
}

main();

const doRender = (fileNames) => {
  fileNames.forEach((singleFileName) => {

    doProcessing(singleFileName);

  });
}

const subDirRender = (dirNames) => {
  return new Promise((resolve, reject) => {
    dirNames.forEach((dir) => {
      const files_in_dir = fs.readdirSync(`${in_dir}/${dir}`);
      files_in_dir.forEach((inner_file) => {
        doProcessing(inner_file, dir);
      });
    })
    resolve();
  });
}