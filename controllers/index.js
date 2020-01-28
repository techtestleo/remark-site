
const { renderSass } = require('./scss/');
const { renameFiles } = require('./path/');
const { makeProcessor } = require('./processor/');

module.exports = {
  renderSass, makeProcessor, renameFiles
}