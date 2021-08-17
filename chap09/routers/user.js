const express = require('express')
const multer = require('multer')

const upload = multer({ dest: 'uploads/' })
const router = express.Router()

const USERS = {
  15: {
    nickname: 'foo',
    profileImageKey: undefined,
  },
  16: {
    nickname: 'bar',
    profileImageKey: undefined,
  },
}

router.get('/', (req, res) => {
  res.send('User list')
})

router.param('id', async (req, res, next, value) => {
  try {
    const user = USERS[value]
    if (!user) {
      const err = new Error('User not found.')
      err.statusCode = 404
      throw err
    }
    req.user = user
    next()
  } catch (err) {
    next(err)
  }
})

// /users/15
router.get('/:id', (req, res) => {
  // req.accepts: string array 혹은 string을 받음, 받을 수 있는 것들을 리스트로 넣어주면 가장 잘 매치되는 것을 돌려줌.
  const resMimeType = req.accepts(['json', 'html'])

  if (resMimeType === 'json') {
    res.send(req.user)
  } else if (resMimeType === 'html') {
    res.render('user-profile', {
      nickname: req.user.nickname,
      userId: req.params.id,
      profileImageURL: `/uploads/${req.user.profileImageKey}`,
    })
  }
})

router.post('/', (req, res) => {
  // Register user
  res.send('User registered')
})

router.post('/:id/nickname', (req, res) => {
  // req: {"nickname": "bar"}
  const { user } = req
  const { nickname } = req.body

  user.nickname = nickname

  res.send(`User nickname updated: ${nickname}`)
})

router.post('/:id/profile', upload.single('profile'), (req, res) => {
  const { user } = req
  const { filename } = req.file
  user.profileImageKey = filename

  res.send(`User profile image uploaded: ${filename}`)
})

module.exports = router
