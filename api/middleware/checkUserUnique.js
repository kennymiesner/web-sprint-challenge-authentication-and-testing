const { findBy } = require('../users/users-model')

module.exports = async function (req, res, next) {
  const {username} = req.body
  const [user] = await findBy({ username })
  if (user) {
    next({ status: 400, message: 'username taken' })
  } else {
    next()
  }
}