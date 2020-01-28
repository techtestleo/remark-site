/**
 * -------------- Path utilities --------------
 * File path & name utilities.
 */
const fs = require('fs');
const path = require('path');
const { log } = require('../log/')
require('dotenv').config();
const out_dir = process.env.build_directory || 'out';
const in_dir = process.env.inbound_md_directory || 'content';
const theme_names = process.env.theme_names.split(',') || ['tech', 'story', 'root', 'home'];
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

const captureThemes = (fName) => {
  let possibleThemes = splitFileName(fName);
  let x = possibleThemes[possibleThemes.length - 1]
  let y = x.split('.');
  return y.filter(theme => theme_names.includes(theme));
}

const getDocCss = (fName) => {
  let themes = captureThemes(fName);
  let refPath = path.relative(fName, `${fName.split(in_dir)[0]}/${in_dir}/`);
  let x = [];
  themes.forEach((theme) => {
    x.push({
      rel: 'stylesheet',
      href: `${refPath.replace('..', '.')}/${theme}.css`
    });
  })
  x.push({
    rel: 'shortcut icon',
    href: '/favicon.ico'
  })
  return x;
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

const renameFiles = (filePaths) => {
  filePaths.forEach((fName) => {
    fs.renameSync(
      fName.replace(in_dir, out_dir),
      makeFileName(fName))
  })
  log(`✅  finished renaming!`, 's');
}

module.exports = {
  getAbsolutePathToFile, getRelativeToPath, splitFileName, getName, getTheme, makeFileName,
  getDocCss, renameFiles
}