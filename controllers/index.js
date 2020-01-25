const { log } = require('./log/')
const { copyDirectoryStructure } = require('./ncp/')
const { renderSass } = require('./scss/')

module.exports = {
  log, copyDirectoryStructure, renderSass
}