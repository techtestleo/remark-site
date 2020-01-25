const { log } = require('./log/')
const { copyDirectoryStructure } = require('./ncp/')
const { renderSass } = require('./scss/')
const { getRelativeToPath, getAbsolutePathToFile } = require('./path/')

module.exports = {
  log, copyDirectoryStructure, renderSass, getRelativeToPath, getAbsolutePathToFile
}