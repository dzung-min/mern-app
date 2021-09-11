require('dotenv').config()
const jwt = require('jsonwebtoken')
const expressJwt = require('express-jwt')
const createHttpError = require('http-errors')

const User = require('../models/user.model')

exports.signin = async (req, res, next) => {
  const { email, password } = req.body
  try {
    const user = await User.findByCredentials(email, password)
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET)
    res.cookie('t', token, { maxAge: 9999 })
    res.json({ data: { token, user } })
  } catch (error) {
    next(error)
  }
}

exports.signout = (req, res) => {
  res.clearCookie('t')
  res.json({ message: 'Signed out' })
}

exports.requireSignIn = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'],
  userProperty: 'auth',
})

exports.hasAuthorization = (req, res, next) => {
  console.log(req.auth._id)
  console.log(req.profile._id)
  if (
    !req.auth ||
    !req.profile ||
    req.auth._id !== req.profile._id.toString()
  ) {
    return next(createHttpError.Unauthorized())
  }
  next()
}
