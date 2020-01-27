const ncp = require('ncp');
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
const stream = require('unified-stream');
const { renderSass, log, copyDirectoryStructure, getRelativeToPath, getAbsolutePathToFile } = require('./controllers');
// Load .env file
require('dotenv').config();

// Global process variables
const out_dir = process.env.build_directory || 'out';
const in_dir = process.env.inbound_md_directory || 'content';






const filePaths = [];

const runNCP = () => {
  return new Promise((resolve, reject) => {

    ncp(in_dir, out_dir, {
      transform: function (read, write) {

      }
    }, function (err) {

    })
  })
}