/**
 * -------------- node-ncp Controller --------------
 *
 */


const ncp = require('ncp');
const { log } = require('../log/');
// Global env variables
require('dotenv').config();
const in_dir = process.env.inbound_md_directory;
const out_dir = process.env.build_directory;
/**
 * Calls ncp() with the in_dir and out_dir, copying only folder.
 */
const copyDirectoryStructure = () => {
  log('✅  reading content folder', 'r');
  return new Promise((resolve, reject) => {
    ncp(in_dir, out_dir, {
      filter: fName => !fName.includes('.')
    }, (err) => {
      if (err) {
        reject(err)
      }
      resolve();
    })
  })
}

/**
 * Exports
 */
module.exports = {
  copyDirectoryStructure
}