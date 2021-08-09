const fs = require('fs')

function readFireInpromise(fileName) {
  return new Promise((resolve, reject) => {
    fs.readFile('.gitignore', 'utf-8', (error, value) => {
      if (error) {
        reject(error)
      }
      resolve(value)
    })
  })
}

async function main() {
  const result = await fs.promises.readFile('.gitignore', 'utf-8')
  console.log(result)
}

main()
// readFireInpromise('.gitignore').then((value) => console.log(value))
// fs.promises.readFile('.gitignore', 'utf-8').then((value) => console.log(value))
