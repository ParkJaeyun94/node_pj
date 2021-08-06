const fs = require('fs')

function readFireInpromise(fileName) {
  return new Promise((resolve, reject) => {
    fs.readFile('.gitignore', 'utf-8', (error, value) => {
      console.log(value)
    })
  })
}
