const { copyDirectoryStructure, transformWithProcessor } = require('./controllers/ncp/');
const { renderSass } = require('./controllers/scss/');
require('dotenv').config();

function main() {
  copyDirectoryStructure().then(() => {
    renderSass().then(() => {
      transformWithProcessor().then(() => {
        log('✅ build complete', 's');
      });
    })
  });
};

main();