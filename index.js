const ncp = require('ncp');
const unified = require('unified');
const markdown = require('remark-parse');
const slug = require('remark-slug');
const toc = require('remark-toc');
const remark2retext = require('remark-retext');
const english = require('retext-english');
const remark2rehype = require('remark-rehype');
const doc = require('rehype-document');
const format = require('rehype-format')
const html = require('rehype-stringify');
const emoji = require('remark-emoji');
const spacing = require('retext-sentence-spacing');
const indefiniteArticle = require('retext-indefinite-article');
const repeated = require('retext-repeated-words')
const spell = require('retext-spell');
const dictionary = require('dictionary-en-gb');
const urls = require('retext-syntax-urls');
const fs = require('fs');
const stream = require('unified-stream');
const { renderSass, getDocCss, getName, makeFileName } = require('./controllers');
require('dotenv').config();
// Global process variables
const out_dir = process.env.build_directory || 'out';
const in_dir = process.env.inbound_md_directory || 'content';
const ignore_spelling = process.env.ignore_spellcheck.split(',') || ['foo', 'bar']

const makePro = (fName) => {
  return processor = unified()
    // enable footnoes
    .use(markdown, { footnotes: true, gfm: true })
    // encode emojs
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
    // convert to html
    .use(html)
    // inject title stylesheet, favicon & style hack to prevent FOUT
    .use(doc, {
      title: getName(fName),
      css: getDocCss(fName),
      style: 'html { visibility: hidden; }',
      link: [{
        rel: 'shortcut icon',
        href: '/favicon.ico'
      }]
    })
    // tidy html
    .use(format);
}


const runNCP = () => {
  const filePaths = [];
  return new Promise((resolve, reject) => {
    ncp(in_dir, out_dir, {
      transform: (read, write, file) => {
        filePaths.push(file.name);
        read
          .pipe(stream(makePro(file.name)))
          .pipe(write)
      }
    }, function (err) {
      resolve(filePaths);
    })
  })
}

runNCP().then((filePaths) => {
  renderSass().then(() => {
    filePaths.forEach((fName) => {
      fs.renameSync(
        fName.replace(in_dir, out_dir),
        makeFileName(fName))
    })
  })
})