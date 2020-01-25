/**
 * -------------- SCSS Processor --------------
 * Uses node fs to read scss files.
 */

const fs = require('fs');
const sass = require('node-sass');
const { log } = require('../log/index');
require('dotenv').config();

// Global process variables
const out_dir = process.env.build_directory || 'out';
const scss_dir = process.env.inbound_scss_directory || 'scss';
const ignore = process.env.ignore_scss.split(',') || ['constants', 'index.css'];
/**
 * Render scss files to the out_dir directory.
 * @param {string[]} scss_fileNames array of filenames to render
 * @returns {Promise<void>} resolves when complete.
 */
const renderStylesheets = (scss_fileNames) => {
  return new Promise((resolve, reject) => {
    scss_fileNames.forEach((single_scss) => {
      const result = sass.renderSync({ file: `${scss_dir}/${single_scss}` });
      //
      const fileWritePath = `${out_dir}/${single_scss.replace('.theme.scss', '.css')}`;
      //
      fs.writeFileSync(fileWritePath, result.css);
      //
      log(`✅ wrote file: ${scss_dir}/${single_scss}`, 's');
    });
    resolve();
  })
}

/**
 * Render the scss directory to css in the /out directory.
 * @returns {Promise<void>} resolves when complete.
 */
const renderSass = () => {
  return new Promise((resolve, reject) => {
    // Read the scss_dir from .env
    let scssFilesToRender = fs.readdirSync(scss_dir, 'utf8');
    // Remove directories and non-scss files from the file to render list.
    scssFilesToRender = scssFilesToRender.filter(item => !ignore.includes(item));
    //
    log(`✍️ rendering ${scss_fileNames.length} scss files`, 'r');
    //
    renderStylesheets(scss_fileNames).then(() => {
      log(`✅ completed ${scss_fileNames.length} scss files`, 's');
      resolve();
    })
  });
}

/**
 * Exports
 */
module.exports = {
  renderSass
}