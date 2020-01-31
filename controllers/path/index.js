/**
 * -------------- Path utilities --------------
 * File path & name utilities.
 */
const fs = require('fs');
const path = require('path');
const { log } = require('../log/');
var vfile = require('to-vfile');
require('dotenv').config();
const out_dir = process.env.build_directory || 'out';
const in_dir = process.env.inbound_md_directory || 'content';
const theme_names = process.env.theme_names.split(',') || ['tech', 'story', 'root', 'home'];

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
  let final = [];
  themes.forEach((theme) => {
    final.push({
      rel: 'stylesheet',
      href: `${refPath.replace('..', '.')}/${theme}.css`
    });
  })
  // add favicon
  final.push({
    rel: 'shortcut icon',
    href: '/favicon.ico'
  })
  // add other links
  //
  return final;
}

const getName = (fName) => {
  let x = splitFileName(fName)
  let y = splitFileName(fName)[x.length - 1];
  return y.split('.')[0];
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

/**
 * Checks if we should inject javascript.
 * @param {string} fName 
 */
const scriptInjector = (fName) => {
  if (!fName.includes('type-fighter/index.game.md')) {

    return []
  }
  return [
    vfile.readSync('./controllers/typefighter/util/index.js', 'utf8').contents,
    vfile.readSync('./controllers/typefighter/index.js', 'utf8').contents
  ]
}


module.exports = {
  renameFiles, getDocCss, getName, splitFileName, scriptInjector
}