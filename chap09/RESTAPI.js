const express = require('express')
// const bodyParser = require('body-parser')

const userRouter = express.Router()

const app = express()
// app.use(bodyParser.json())
app.use(express.json())

app.use(express.static('chap09/public'))

app.set('views', 'chap09/views')
app.set('view engine', 'pug')

const PORT = 5000

userRouter.get('/', (req, res) => {
  res.send('User list')
})

const USERS = {
  15: {
    nickname: 'foo',
  },
}

userRouter.param('id', (req, res, next, value) => {
  console.log(`id parameter`, value)
  req.user = USERS[value]
  next()
})

// /users/15
userRouter.get('/:id', (req, res) => {
  const resMimeType = req.accepts(['json', 'html'])

  if (resMimeType === 'json') {
    res.send(req.user)
  } else if (resMimeType === 'html') {
    res.render('user-profile', {
      nickname: req.user.nickname,
    })
  }
})

userRouter.post('/', (req, res) => {
  // Register user
  res.send('User registered')
})

userRouter.post('/:id/nickname', (req, res) => {
  // req: {"nickname": "bar"}
  const { user } = req
  const { nickname } = req.body

  user.nickname = nickname

  res.send(`User nickname updated: ${nickname}`)
})

app.use('/users', userRouter)

app.get('/', (req, res) => {
  res.render('user-profile', {
    message: 'Hello, pug!!',
  })
})

app.listen(PORT, () => {
  console.log(`The Express server is listening at port : ${PORT}`)
})
