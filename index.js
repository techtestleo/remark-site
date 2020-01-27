const ncp = require('ncp');
const fs = require('fs');
const stream = require('unified-stream');
const { renderSass, makeFileName, makeProcessor } = require('./controllers');
require('dotenv').config();
// Global process variables
const out_dir = process.env.build_directory || 'out';
const in_dir = process.env.inbound_md_directory || 'content';

const runNCP = () => {
  const filePaths = [];
  return new Promise((resolve, reject) => {
    ncp(in_dir, out_dir, {
      transform: (read, write, file) => {
        filePaths.push(file.name);
        read
          .pipe(stream(makeProcessor(file.name)))
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