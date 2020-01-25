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
var format = require('rehype-format')
var html = require('rehype-stringify');
var retext = require('retext')
var emoji = require('retext-emoji');
var spacing = require('retext-sentence-spacing');
var indefiniteArticle = require('retext-indefinite-article');
var repeated = require('retext-repeated-words')
var spell = require('retext-spell');
var dictionary = require('dictionary-en-gb');
var urls = require('retext-syntax-urls');
var fs = require('fs');
var sass = require('node-sass');
const chalk = require('chalk');
const ncp = require('ncp');
var path = require('path');
chalk.level = 3;
// Chalk styles
const reading = chalk.yellow;
const writing = chalk.magenta;
const success = chalk.green;
// Load .env file
require('dotenv').config();

const { renderSass, log, copyDirectoryStructure } = require('./controllers/');


// Global process variables
const out_dir = process.env.build_directory || 'out';
const in_dir = process.env.inbound_md_directory || 'content';
const renderExtension = process.env.render_extension || '.html';
const scss_dir = process.env.inbound_scss_directory || 'scss';
const ignore = process.env.ignore_scss.split(',') || ['constants', 'index.css'];
const ignore_spelling = process.env.ignore_spellcheck.split(',') || ['foo', 'bar'];

/**
 * Wrapper for find absolute filepaths. Used during file read.
 * @param {string} fileName 
 * @param {string} subDir 
 * @param {boolean} inOut 
 */
const getPathToFile = (fileName, subDir, inOut) => {
  let dirChoice = inOut ? in_dir : out_dir;
  let pathToReturn = path.resolve(dirChoice, fileName);
  if (subDir !== undefined) {
    pathToReturn = path.resolve(dirChoice, subDir, fileName);
  }
  return pathToReturn;
}

/**
 * Wrapper for finding relative file path. Used for writing css locations.
 * @param {string} fileName 
 */
const getRelativePath = (fileName) => {
  return path.relative(out_dir, fileName);
}

/**
 * 
 * @param {string} fileName 
 */
const make = (fileName) => {
  const fileNameArr = fileName.split('.');
  const validTheme = fileNameArr[fileNameArr.length - 2];
  return processor = unified()
    // enable footnoes
    .use(markdown, { footnotes: true, gfm: true })
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
      // .use(spell, { dictionary, ignore: ignore_spelling })
    )
    // ad id's to heading level elements
    .use(slug)
    // enable creating a table of linked headings in files that have a "Table of Contents" heading
    .use(toc)
    // convert to html syntax tree
    .use(remark2rehype)
    // convert to html
    .use(html)
    .use(format)
    .use(doc, {
      title: fileNameArr[0],
      css: `${getRelativePath(validTheme)}.css`,
      style: 'html { visibility: hidden; }',
      link: [{
        rel: 'shortcut icon',
        href: '/favicon.ico'
      }]
    })
};

function logger() {

}
/**
 * Process a markdown file.
 * @param {string} fileName 
 * @param {string} subDir 
 */
const processMdFile = (fileName, subDir) => {
  make(fileName).process(vfile.readSync(`${getPathToFile(fileName, subDir ? subDir : undefined, true)}`), (err, file) => {
    if (err) {
      reject(err);
    }
    // Log warnings
    console.warn(report(file));

    file.basename = fileName.split('.')[0];
    // set the extension
    file.extname = renderExtension;

    file.dirname = `${out_dir}${subDir ? '/' + subDir : ''}`
    // convert shortcode emojis
    var convertedFile = retext()
      .use(emoji, { convert: 'encode' })
      .processSync(file);
    // write file
    vfile.writeSync(convertedFile)
  });
}

/**
 * Render /content -> /out, transforming to HTML.
 */
const renderContentDirectory = () => {
  const results = fs.readdirSync(in_dir);

  results.forEach((item) => {
    if (item.includes('.md')) {

      processMdFile(item);
    }
  });
  //
  const remainingDirectories = results.filter((item) => {
    if (item.split('.').length === 1) {
      return item;
    }
  });
  //
  remainingDirectories.forEach((subDir) => {
    const files = fs.readdirSync(`${in_dir}/${subDir}`);
    files.forEach((item) => {
      if (item.includes('.md')) {
        processMdFile(item, subDir);
      }
    });
  });

};
/**
 * Main
 */
const main = () => {
  return new Promise((resolve, reject) => {
    copyDirectoryStructure().then(() => {
      log('✅  ncp complete', 's');
      renderSass().then(() => {
        log('✅  scss rendering complete', 's');
        renderContentDirectory();

      });
    })
  });
}

main();