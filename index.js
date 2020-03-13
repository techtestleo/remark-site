const ncp = require('ncp');
const stream = require('unified-stream');
const { renderSass, renameFiles, makeProcessor } = require('./controllers');
require('dotenv').config();
// Global process variables
const out_dir = process.env.build_directory || 'out';
const in_dir = process.env.inbound_md_directory || 'content';

/**
 * Wrapper for node-ncp.
 * TODO: We could pass in_dir & out_dir as params rather than pulling from global .env file. 
 */
const renderHtml = () => {
  return new Promise((resolve, reject) => {
    const filePaths = [];
    ncp(in_dir, out_dir, {
      transform: (read, write, file) => {
        // Keep track of each file we process
        filePaths.push(file.name);
        read
          .pipe(stream(makeProcessor(file.name)))
          .pipe(write)
      }
    }, function (err) {
      if (err) { reject(err); }
      // resolve with a list of files we have processed.
      resolve(filePaths);
    })
  })
}

/**
 * Main rendering function.
 * 
 * Steps:
 * 1. Copy & paste the content directory using node ncp().
 * 2. Using ncp.transform, we can pass the ReadableStream through a unified processor.
 * 3. This processor transfroms all .md files in the content directory (and sub directories) into html.
 * 4. We then process our scss files into CSS
 * 5. We then rename processed .md files into .html
 */
function main () {
  renderHtml().then((filePaths) => {
    renderSass().then(() => {
      renameFiles(filePaths);
    })
  })
}

main();