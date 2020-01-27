const { log } = require('./log/')
const { copyDirectoryStructure } = require('./ncp/')
const { renderSass } = require('./scss/')
const { getRelativeToPath, getAbsolutePathToFile, makeFileName, getName, getTheme, splitFileName, getDocCss } = require('./path/')

module.exports = {
  log, copyDirectoryStructure, renderSass, getRelativeToPath, getAbsolutePathToFile, makeFileName, getName, getTheme, splitFileName, getDocCss
}