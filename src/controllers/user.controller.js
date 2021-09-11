require('dotenv').config()
const createHttpError = require('http-errors')
const jwt = require('jsonwebtoken')

const User = require('../models/user.model')

exports.create = async (req, res, next) => {
  try {
    const user = await User.create(req.body)
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET)
    res.cookie('t', token, { maxAge: 9999 })
    res.status(201).json({ data: { token, user } })
  } catch (error) {
    next(error)
  }
}

exports.list = async (req, res, next) => {
  try {
    const users = await User.find()
    res.json({ data: users })
  } catch (error) {
    next(error)
  }
}

exports.getById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      throw createHttpError.NotFound()
    }
    req.profile = user
    next()
  } catch (error) {
    next(error)
  }
}

exports.read = async (req, res, next) => {
  res.json({ data: req.profile })
}

exports.update = async (req, res, next) => {
  try {
    const user = req.profile
    const allowedUpdates = ['name', 'email', 'password']
    allowedUpdates.forEach((update) => {
      user[update] = req.body[update] || user[update]
    })
    await user.save()
    res.json({ data: user })
  } catch (error) {
    next(error)
  }
}

exports.remove = async (req, res, next) => {
  try {
    const user = req.profile
    const deletedUser = await user.remove()
    res.json({ data: deletedUser })
  } catch (error) {
    next(error)
  }
}
