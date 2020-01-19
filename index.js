require('dotenv').config();
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
var dictionary = require('dictionary-en-gb');
var urls = require('retext-syntax-urls');
var fs = require('fs');
var sass = require('node-sass');
const chalk = require('chalk');
// Chalk styles
const reading = chalk.bold.yellow;
const success = chalk.keyword('green');


// Global process variables
const out_dir = process.env.build_directory || 'out';
const in_dir = process.env.inbound_md_directory || 'content';
const renderExtension = process.env.render_extension || '.html';
const scss_dir = process.env.inbound_scss_directory || 'scss';
const finalStylesheetName = process.env.injected_stylesheet || 'index.css';
const ignore = process.env.ignore_scss.split(',');

var processor = unified()
  // enable footnoes
  .use(markdown, { footnotes: true })
  .use(
    remark2retext,
    unified()
      .use(english)
      .use(indefiniteArticle)
      .use(spacing)
      .use(urls)
      .use(spell, dictionary)
  )
  // ad id's to heading level elements
  .use(slug)
  // enable creating a table of linked headings in files that have a
  // ## Table of Contents
  .use(toc)
  .use(remark2rehype)
  .use(doc, { css: finalStylesheetName })
  .use(html)



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
      fs.writeFileSync(`${out_dir}/${single_scss.replace('.scss', '.css')}`, result.css);
      console.log(success(`wrote file: ${scss_dir}/${single_scss.replace('.scss', '.css')}`));
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

      console.log(reading(`reading ${scss_fileNames.length} scss files...`));

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
      fileNames.forEach((singleFileName) => {
        // process each file
        processor.process(vfile.readSync(`${in_dir}/${singleFileName}`), function (err, file) {
          if (err) { throw err; }
          // Log warnings
          console.warn(report(file));

          // set the directory
          file.dirname = out_dir;
          // convert shortcode emojis
          var convertedFile = retext()
            .use(emoji, { convert: 'encode' })
            .processSync(file)

          // set the extension
          file.extname = renderExtension;
          // write file
          vfile.writeSync(convertedFile)
        });
      });
    });
  });
}

main();