// @ts-check

const express = require('express')

const fs = require('fs')

const app = express()

const PORT = 5000

app.use('/', async (req, res, next) => {
  console.log('Middleware 1')

  const fileContent = await fs.promises.readFile('.gitignore')
  const requestedAt = new Date()
  req.requestedAt = requestedAt
  req.fileContent = fileContent
  next()
})

app.use((req, res) => {
  console.log('Middleware 2')
  res.send(`Requested at ${req.requestedAt},${req.fileContent} `)
})

app.listen(PORT, () => {
  console.log(`The Express server is listening at port : ${PORT}`)
})
