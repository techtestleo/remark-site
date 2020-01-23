var remark = require('remark')
var concat = require('concat-stream')


function onconcat(buf) {
  var doc = remark()
    .processSync(buf)
    .toString()

  process.stdout.write(doc)
}

process.stdin.pipe(concat(onconcat))