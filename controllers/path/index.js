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

/**
 * Capture all valid themes that exist on a filepath. 
 * @param {string} fName 
 */
const captureThemes = (fName) => {
  let possibleThemes = splitFileName(fName);
  let x = possibleThemes[possibleThemes.length - 1]
  let y = x.split('.');
  return y.filter(theme => theme_names.includes(theme));
}

/**
 * Find the relevant stylesheet from a theme name, in a file path. 
 * @param {string} fName Filename that is looking for a theme.
 */
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
  });
  return final;
}

/**
 * Returns the name portion of a filename with [name].[theme].[ext]
 * Used to generate the document title.
 * @param {string} fName Filename
 */
const getDocumentName = (fName) => {
  // We first get each element of the filename by splitting on '/'
  let x = splitFileName(fName)
  // We then grab the last element in this array. This element will always contain
  // the name & theme name of the file: example.foo.md
  let y = splitFileName(fName)[x.length - 1];
  // We then split the file name on '.', and look at the first element in this array
  // This element will be the name of the file. 
  let name = y.split('.')[0];
  log(name, 's');
  // Capitalise the title.
  return name.charAt(0).toUpperCase() + name.slice(1);
}

/**
 * Generates a correct filename from an unprocessed filename. 
 * @param {string} fName Filename to process. 
 */
const makeFileName = (fName) => {
   // We first get each element of the filename by splitting on '/'
  let x = splitFileName(fName);
  return fName
  // Replace in_dir name with out_dir name.
    .replace(in_dir, out_dir)
    .replace(
      // We need to replace any '[name].[theme].md' with '[name].html'
      splitFileName(fName)[x.length - 1],
      splitFileName(fName)[x.length - 1].split('.')[0]) + '.html';
}

/**
 * Finds and renames each file in place.
 * @param {string[]} filePaths Array of files to rename
 */
const renameFiles = (filePaths) => {
  filePaths.forEach((fName) => {
    fs.renameSync(
      fName.replace(in_dir, out_dir),
      makeFileName(fName))
  })
  log(`✅  finished renaming!`, 's');
}

/**
 * Bespoke script injector.
 * 
 * TODO: Instead of specifiying each script to run, we should specify
 * a directory from which to inject. All scripts in this directory should
 * be injected into the requisite file. Any shared functions or helpers 
 * should be in a /helper directory. 
 * 
 * @param {string} fName 
 */
const scriptInjector = (fName) => {
  if (fName.includes('type-fighter/index.typer.md')) {
    return [
      vfile.readSync('./controllers/typefighter/util/index.js', 'utf8').contents,
      vfile.readSync('./controllers/engine/capture.js', 'utf8').contents,
      vfile.readSync('./controllers/engine/robot.js', 'utf8').contents,
      vfile.readSync('./controllers/engine/view.js', 'utf8').contents,
      vfile.readSync('./controllers/engine/memory.js', 'utf8').contents,
      vfile.readSync('./controllers/typefighter/index.js', 'utf8').contents
    ]
  } else if (fName.includes('guildhall/index.guild.md')) {
    return [
      vfile.readSync('./controllers/guildhall/engine/capture.js', 'utf8').contents,
      vfile.readSync('./controllers/guildhall/engine/hero.js', 'utf8').contents,
      vfile.readSync('./controllers/guildhall/engine/item.js', 'utf8').contents,
      vfile.readSync('./controllers/guildhall/engine/memory.js', 'utf8').contents,
      vfile.readSync('./controllers/guildhall/engine/state.js', 'utf8').contents,
      vfile.readSync('./controllers/guildhall/engine/view.js', 'utf8').contents,
      vfile.readSync('./controllers/guildhall/index.js', 'utf8').contents,
    ]
  } else {
    return [];
  }
}

module.exports = {
  renameFiles, getDocCss, getDocumentName, splitFileName, scriptInjector
}