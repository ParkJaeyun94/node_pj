// @ts-check
// Formatting, Linting, Type Checking
// Formatting: Prettier
// Linting: ESLint
// Type checking: TypeScript

/* eslint-disable-next-line no-console */

const http = require('http')

const server = http.createServer((req, res) => {
  res.statuscod = 200
  res.end('Hello!')
})

const PORT = 4000
server.listen(PORT, () => {
  console.log(`The server is listening at port ${PORT}`)
})
