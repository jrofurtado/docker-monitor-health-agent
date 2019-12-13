const fs = require('fs')

fs.readFile('expires.txt', 'utf8', (error, contents) => {
  if(error) {
    process.exit(1)
  }
  now = new Date().getTime()
  if (parseInt(contents, 10) < now) {
    process.exit(1)
  }
  process.exit(0)
})
