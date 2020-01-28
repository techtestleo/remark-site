
const { renderSass } = require('./scss/');
const { getName, getDocCss, makeFileName, renameFiles } = require('./path/');
const { makeProcessor } = require('./processor/');

module.exports = {
  renderSass, getName, getDocCss, makeProcessor, makeFileName, renameFiles
}