const express = require('express')
// const bodyParser = require('body-parser')

const app = express()
app.use(express.json())
app.set('views', 'chap09/views')
app.set('view engine', 'pug')

const userRouter = require('./routers/user')

app.use('/users', userRouter)
app.use('/public', express.static('chap09/public'))
app.use('/uploads', express.static('uploads'))

// express 4개 인자를 받으면 error 핸들링이란걸 알고있음.
app.use((err, req, res, next) => {
  res.statusCode = err.statusCode || 500
  res.send(err.message)
})

module.exports = app
