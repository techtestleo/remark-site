/**
 * -------------- node-ncp Controller --------------
 *
 */


const ncp = require('ncp');
var concat = require('concat-stream');
const stream = require('unified-stream')
const { log } = require('../log/');
// Global env variables
require('dotenv').config();
const in_dir = process.env.inbound_md_directory;
const out_dir = process.env.build_directory;
/**
 * 
 * @param {Buffer} buf 
 * @param {unified.Processor} processor Unified processor
 */
const onconcat = (buf, processor, writeStream) => {
  //
  const doc = processor.processSync(buf).toString()
  //
  writeStream.pipe(doc);
}
/**
 * Calls ncp() with the in_dir and out_dir, copying only folder.
 */
const copyDirectoryStructure = () => {
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
 * Function to call with ncp.transform 
 * @param {NodeJS.ReadableStream} read 
 * @param {NodeJS.WritableStream} write
 * @param {unified.Processor} processor Unified processor
 */
const transformer = (read, write, file, processor) => {
  log(`reading file: ${file.name}`, 'r');
  /**
   * Function must end with read.pipe([writable content])
   */
  read.pipe(concat((b) => { onconcat(b, processor) }));
};

/**
 * Resolver function.
 * @param {*} err 
 * @param {*} resolve 
 * @param {*} reject 
 */
const resolution = (err, resolve, reject) => {
  if (err) {
    log(err, 'e');
    //
    reject(err);
  }
  //
  log('✅ completed file tranform ', 's');
  //
  resolve()
}

const transformWithProcessor = (processor) => {
  return new Promise((resolve, reject) => {
    ncp(in_dir, out_dir, {
      transform: (read, write, file) => { transformer(read, write, file, processor) }
    }, (e) => { resolution(e, resolve, reject) });
  })
}

/**
 * Exports
 */
module.exports = {
  copyDirectoryStructure,
  transformWithProcessor
}