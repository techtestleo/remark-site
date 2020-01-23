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
const ncp = require('ncp');
chalk.level = 3;
// Chalk styles
const reading = chalk.yellow;
const writing = chalk.magenta;
const success = chalk.green;
var path = require('path');
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
const themes = process.env.theme_names || '';
const searchString = new RegExp(ignore_ext, "g");


const runNCP = () => {
  return new Promise((resolve, reject) => {
    ncp(in_dir, out_dir, {
      filter: fName => !fName.includes('.')
    }, (err) => {
      if (err) {
        reject(err)
      }
      resolve();
    })
  })
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
      console.log(writing(`wrote file: ${scss_dir}/${single_scss.replace('.theme..scss', '.css')}`));
    });
    resolve();
  })
}

/**
 * Read the scss_dir, and render css files to the out_dir with renderStylesheets().
 */
const renderSass = () => {
  return new Promise((resolve, reject) => {
    fs.readdir(scss_dir, 'utf8', (err, scss_fileNames) => {

      // remove directory name and processed files from render list
      scss_fileNames = scss_fileNames.filter(item => !ignore.includes(item));

      console.log(reading(`rendering ${scss_fileNames.length} scss files`));

      renderStylesheets(scss_fileNames).then(() => {
        resolve();
      })
    })
  });
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
    .use(doc, {
      title: fileNameArr[0],
      css: `${getPathToFile(validTheme, undefined, false)}${validTheme ? validTheme : 'index'}.css`,
      link: {
        rel: 'shortcut icon',
        href: '/favicon.ico'
      }
    })
    // convert to html
    .use(html)
};

const getPathToFile = (fileName, subDir, inOut) => {
  let x = path.resolve(inOut ? in_dir : out_dir, fileName);
  if (subDir !== undefined) {
    x = path.resolve(inOut ? in_dir : out_dir, subDir, fileName);
  }
  return x;
}

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

const readOutDir = () => {
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

const main = () => {
  return new Promise((resolve, reject) => {
    runNCP().then(() => {
      console.log(success('ncp complete ✅'));
      renderSass().then(() => {
        console.log(success('scss rendering complete ✅'));
        readOutDir();

      });
    })
  });
}

main();