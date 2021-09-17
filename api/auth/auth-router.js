const router = require('express').Router()
const bcrypt = require('bcryptjs')
const checkUserExists = require('../middleware/checkUserExists')
const checkUserUnique = require('../middleware/checkUserUnique')
const User = require('../users/users-model')
const buildToken = require('../middleware/build-token')

router.post('/register', checkUserUnique, async (req, res, next) => {
  try {
    const { username, password } = req.body
    const hash = bcrypt.hashSync(password, 8)
    const user = await User.add({ username, password: hash })
    res.status(201).json(user)
  } catch (err) {
    next(err)
  }
})

router.post('/login', checkUserExists, (req, res, next) => {
  const { password } = req.body
  if (bcrypt.compareSync(password, req.user.password)) {
    const token = buildToken(req.user)
    res.status(200).json({
      message: `welcome, ${req.user.username}`,
      token
    })
  } else {
    next({ status: 401, message: 'invalid credentials' })
  }
})

module.exports = router
