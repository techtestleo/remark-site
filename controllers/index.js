
const { renderSass } = require('./scss/');
const { getName, getBase, getTheme, getDocCss, makeFileName, renameFiles } = require('./path/');
const { makeProcessor } = require('./processor/');

module.exports = {
  renderSass, getName, getTheme, getDocCss, makeProcessor, makeFileName, renameFiles
}