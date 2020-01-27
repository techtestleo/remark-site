
const { renderSass } = require('./scss/');
const { getName, getTheme, getDocCss, makeFileName } = require('./path/');
const { makeProcessor } = require('./processor/');

module.exports = {
  renderSass, getName, getTheme, getDocCss, makeProcessor, makeFileName
}