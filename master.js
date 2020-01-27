const unified = require('unified');
const vfile = require('to-vfile');
const report = require('vfile-reporter');
const markdown = require('remark-parse');
const slug = require('remark-slug');
const toc = require('remark-toc');
const remark2retext = require('remark-retext');
const english = require('retext-english');
const remark2rehype = require('remark-rehype');
const doc = require('rehype-document');
const format = require('rehype-format')
const html = require('rehype-stringify');
const retext = require('retext')
// const emoji = require('retext-emoji');
const emoji = require('remark-emoji');
const spacing = require('retext-sentence-spacing');
const indefiniteArticle = require('retext-indefinite-article');
const repeated = require('retext-repeated-words')
const spell = require('retext-spell');
const dictionary = require('dictionary-en-gb');
const urls = require('retext-syntax-urls');
const fs = require('fs');
const { renderSass, log, copyDirectoryStructure, getRelativeToPath, getAbsolutePathToFile } = require('./controllers');
// Load .env file
require('dotenv').config();

// Global process variables
const out_dir = process.env.build_directory || 'out';
const in_dir = process.env.inbound_md_directory || 'content';
const renderExtension = process.env.render_extension || '.html';
const ignore_spelling = process.env.ignore_spellcheck.split(',') || ['foo', 'bar'];

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
    .use(emoji)
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
    // .use(logger)
    // convert to html
    .use(html)
    .use(format)
    .use(doc, {
      title: fileNameArr[0],
      css: `${getRelativeToPath(validTheme)}.css`,
      style: 'html { visibility: hidden; }',
      link: [{
        rel: 'shortcut icon',
        href: '/favicon.ico'
      }]
    })
};

function logger() {
  return console.dir;
}

/**
 * Process a markdown file.
 * @param {string} fileName 
 * @param {string} subDir 
 */
const processMdFile = (fileName, subDir) => {
  make(fileName).process(vfile.readSync(`${getAbsolutePathToFile(fileName, subDir ? subDir : undefined, true)}`),
    (err, file) => {
      if (err) {
        reject(err);
      }
      // Log warnings
      console.warn(report(file));
      //
      file.basename = fileName.split('.')[0];
      // set the extension
      file.extname = renderExtension;
      // set write directory
      file.dirname = `${out_dir}${subDir ? '/' + subDir : ''}`
      // convert shortcode emojis
      // write file
      vfile.writeSync(file)
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