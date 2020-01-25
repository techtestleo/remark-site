


require('dotenv').config();
const ncp = require('ncp');
const unified = require('unified');
var markdown = require('remark-parse')
var remark2rehype = require('remark-rehype')
var html = require('rehype-stringify')
var doc = require('rehype-document')
var format = require('rehype-format')
var rehype = require('rehype')
var section = require('rehype-section')
var slug = require('rehype-slug');
var toc = require('remark-toc');


let processor = unified()

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
  // In: Remark
  // remark plugin to generate a Table of Contents.
  // Out: Remark
  // Phase end-3
  .use(toc)
  // In: hast syntax tree
  // rehype plugin to wrap a document around a fragment.
  // Out: HTML
  // Phase end-3
  .use(doc)
  // In: HTML
  // Applies linting to html.
  // Out: HTML
  // Phase: end-3
  .use(format)
  // In: HTML
  // Stringifies hast syntax trees to HTML. 
  // Out: HTML
  // Phase: end-2
  .use(html)
  // In: HTML
  // Mutate nested segments
  // Out: HTML wrapped in <section> tags
  // Phase: end-1
  .use(section)


const processor = unified()