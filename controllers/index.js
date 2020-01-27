
const { renderSass } = require('./scss/');
const { getName, getTheme, getDocCss } = require('./path/');
const { makeProcessor } = require('./processor/');

module.exports = {
  renderSass, getName, getTheme, getDocCss, makeProcessor
}