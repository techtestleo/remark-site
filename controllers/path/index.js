/**
 * -------------- Path utilities --------------
 * Uses node path to return absolute and relative filepaths.
 */
const path = require('path');
require('dotenv').config();
const out_dir = process.env.build_directory || 'out';
const in_dir = process.env.inbound_md_directory || 'content';
/**
 * Wrapper for find absolute filepaths. Used during file read.
 * @param {string} fileName 
 * @param {string} subDir 
 * @param {boolean} inOut 
 */
const getAbsolutePathToFile = (fileName, subDir, inOut) => {
  let dirChoice = inOut ? in_dir : out_dir;
  let pathToReturn = path.resolve(dirChoice, fileName);
  if (subDir !== undefined) {
    pathToReturn = path.resolve(dirChoice, subDir, fileName);
  }
  return pathToReturn;
}

/**
 * Wrapper for finding relative file path. Used for writing css locations.
 * @param {string} fileName 
 */
const getRelativeToPath = (fileName) => {
  return path.relative(out_dir, fileName);
}

const splitFileName = (fName) => { return fName.split('/'); }

const getDocCss = (fName) => {
  return `${getRelativeToPath(getTheme(fName))}.css`
}

const getName = (fName) => {
  let x = splitFileName(fName)
  let y = splitFileName(fName)[x.length - 1];
  return y.split('.')[0];
}
const getTheme = (fName) => {
  let x = splitFileName(fName)
  let y = splitFileName(fName)[x.length - 1];
  return y.split('.')[1];
}

const makeFileName = (fName) => {
  let x = splitFileName(fName);
  return fName
    .replace(in_dir, out_dir)
    .replace(
      splitFileName(fName)[x.length - 1],
      splitFileName(fName)[x.length - 1].split('.')[0]) + '.html';
}


module.exports = {
  getAbsolutePathToFile, getRelativeToPath, splitFileName, getName, getTheme, makeFileName,
  getDocCss
}