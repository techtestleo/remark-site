/**
 * V2
 * 
 * Steps
 * 1. ncp /content to out.
 * 2. Read root of /scss directory
 * 3. sass.Render() to /out all files matching [name].theme.scss
 * 
 * We are now ready to transform all .md files in the /our directory in place. 
 * 
 * 4. 
 *
 */


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
const chalk = require('chalk');
var stream = require('unified-stream')
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


const make = (fileTheme, nestedPath, fileName) => {
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
            title: fileName,
            css: `${nestedPath ? "../" : ''}${fileTheme ? fileTheme : 'index'}.css`,
            link: {
                rel: 'shortcut icon',
                href: '/favicon.ico'
            }
        })
        // convert to html
        .use(html)
        .use(stream(html))
}



const runNCP = () => {
    return new Promise((resolve, reject) => {

        ncp(in_dir, out_dir, {
            transform: (read, write) => {
                console.log('transforminh');
            }
        }, (err) => {
            console.log(err);
            console.log('complete callback');
            if (err) reject(err);
            resolve();
        });
    });
}

runNCP().then(() => { });