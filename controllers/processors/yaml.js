/**
 * -------------- YAML Unified Processor --------------
 * 
 */
const vfile = require('to-vfile');
const unified = require('unified');
const parse = require('remark-parse');
const stringify = require('remark-stringify');
const frontmatter = require('remark-frontmatter');
const path = require('path');
//
require('dotenv').config();
const out_dir = process.env.build_directory || 'out';
const in_dir = process.env.inbound_md_directory || 'content';
//
const getPathToFile = (fileName, subDir, inOut) => {
  let dirChoice = inOut ? in_dir : out_dir;
  let pathToReturn = path.resolve(dirChoice, fileName);
  if (subDir !== undefined) {
    pathToReturn = path.resolve(dirChoice, subDir, fileName);
  }
  return pathToReturn;
}
/**
 * @returns {unified.Processor}
 */
const yamlProcessor = () => {
  return unified()
    .use(parse)
    .use(stringify)
    .use(frontmatter, ['yaml', 'toml'])
    .use(logger)
}
function logger() {
  // return console.dir
}
const generateStubs = (fileName, subDir) => {
  return new Promise((resolve, reject) => {
    yamlProcessor().process(vfile.readSync(`${getPathToFile(fileName, subDir ? subDir : undefined, true)}`), (err, file) => {
      if (err) reject(err);
      //
      const json = JSON.stringify(file)
      console.log(json)
      //
      file.dirname = `${out_dir}/stubs`;
      file.extname = '.JSON';
      //
      vfile.writeSync(file);
      resolve();
    })
  })
}

module.exports = {
  generateStubs,
  yamlProcessor,
  generateStubs
}