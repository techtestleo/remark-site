const ncp = require('ncp');
const stream = require('unified-stream');
const { renderSass, renameFiles, makeProcessor } = require('./controllers');
require('dotenv').config();
// Global process variables
const out_dir = process.env.build_directory || 'out';
const in_dir = process.env.inbound_md_directory || 'content';

const renderHtml = () => {
  return new Promise((resolve, reject) => {
    const filePaths = [];
    ncp(in_dir, out_dir, {
      transform: (read, write, file) => {
        filePaths.push(file.name);
        read
          .pipe(stream(makeProcessor(file.name)))
          .pipe(write)
      }
    }, function (err) {
      if (err) { reject(err); }
      resolve(filePaths);
    })
  })
}

renderHtml().then((filePaths) => {
  renderSass().then(() => {
    renameFiles(filePaths);
  })
})