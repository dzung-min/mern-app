const { Schema, model } = require('mongoose')
const { default: validator } = require('validator')
const bcrypt = require('bcrypt')
const createHttpError = require('http-errors')

const UserSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: 'Name is required',
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      required: 'Email is required',
      unique: true,
      validate: (value) => {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email address')
        }
      },
    },
    password: {
      type: String,
      trim: true,
      required: 'Password is required',
      minlength: [8, 'Password is too short'],
    },
  },
  {
    timestamps: true,
  }
)

UserSchema.pre('save', async function () {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8)
  }
})

UserSchema.methods.toJSON = function () {
  const user = this.toObject()
  delete user.password
  return user
}

UserSchema.statics.findByCredentials = async function (email, password) {
  if (!email || !password) {
    throw createHttpError.BadRequest('Email and password are required')
  }
  const user = await this.findOne({ email })
  if (!user) {
    throw createHttpError.Unauthorized("User doesn't exist")
  }
  const isPasswordMatch = await bcrypt.compare(password, user.password)
  if (!isPasswordMatch) {
    throw createHttpError.Unauthorized("Email and password don't match")
  }
  return user
}

module.exports = model('User', UserSchema)
