const ncp = require('ncp');
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
var path = require('path');
// Load .env file
require('dotenv').config();
var remark = require('remark');
var concat = require('concat-stream');
//
const themes = process.env.theme_names || '';
const searchString = new RegExp(themes, "g");
/**
 * 
 * @param {*} buf 
 * @param {NodeJS.WritableStream} writeStream 
 * @param {string} fName 
 */
function transform(read, write, fName) {
  console.log(read, write);
  return new Promise((resolve, reject) => {
    const parts = fName.split('.');
    const bits = parts[parts.length - 3].split('/');
    let title = bits[bits.length - 1];
    //
    var pro = remark()
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
      .use(slug)
      // enable creating a table of linked headings in files that have a "Table of Contents" heading
      .use(toc)
      // convert to html syntax tree
      .use(remark2rehype)
      //
      .use(doc, { title: title })
      .use(html)
      // .use(html)
      .processSync(read)
      //
      .toString()
    //
    write.pipe(pro)
    resolve(pro);
  });
}
//
const out_dir = process.env.build_directory || 'out';
const in_dir = process.env.inbound_md_directory || 'content';

/**
 * Passed to the filter param of ncp.filter
 * Only allows the copying of folders.
 * @param {string} fName 
 * @param {boolean} filesOrDirectories
 * @returns {boolean}
 */
const ncpFilter = (fName, filesOrDirectories) => {
  if (filesOrDirectories) {
    return !fName.includes('.');
  } else {
    return fName.includes('.');
  }
};

/**
 * Passed to the transform param of ncp.transform
 * @param {NodeJS.ReadableStream} read
 * @param {NodeJS.WritableStream} write
 * @param {ncp.File} file
 * @param {boolean} flag
 */
const ncpTransform = (read, write, file) => {
  return new Promise((resolve, reject) => {
    console.log('////////// transforming  ///////////');
    transform(read, write, file.name).then((res) => {
      resolve({
        payload: res,
        file: file
      });
    })
    console.log('///////// transform complete  ////////////');
  })
}
/**
 * 
 * @param {string} fileName 
 */
const correctPath = (fileName) => {
  let x = fileName;
  x = x.replace('content', 'out');
  x = x.replace('.md', '.html');
  if (x.match(searchString).length > 0) {
    x = x.replace(x.match(searchString), '')
  };
  return x;
}
/**
 * 
 * @param {boolean} filesOrDirectories
 * @param {number} phase
 */
const runNCP = (phase) => {
  console.log('phase:  ' + phase);
  return new Promise((resolve, reject) => {
    if (phase === 1) {
      ncp(in_dir, out_dir, {
        filter: (fileName) => {
          return ncpFilter(fileName, false);
        }
      }, (err) => {
        if (err) {
          reject(err)
        }
        resolve();
      })
    }
    //
    if (phase === 2) {
      ncp(in_dir, out_dir, {
        filter: (fileName) => {
          console.log('phase 2:  ' + fileName);
          return ncpFilter(fileName, true);
        }
      }, (err) => {
        if (err) {
          reject(err)
        }
        ncp(in_dir, out_dir, {
          transform: (read, write, file) => {
            ncpTransform(read, write, file).then((res) => {
              res.file.name = correctPath(res.file.name);
              res.file.name = res.file.name.replace('.md', '.html');

              console.log('Writing: ' + res.file.name);
              // fs.writeFileSync(res.file.name, res.payload, 'utf8');
            });
          },
        }, (err) => {
          if (err) {
            reject(err)
          }
          // ncp phase 2b
          resolve();
        })
        // ncp phase 2a
      })
    }
  })
}

runNCP(1).then(() => {
  runNCP(2).then(() => {

  })
})