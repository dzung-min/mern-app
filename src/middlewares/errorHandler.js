const createHttpError = require('http-errors')

exports.notFound = (req, res, next) => {
  next(createHttpError.NotFound())
}

exports.gereric = (err, req, res, next) => {
  const error = normalizeError(err)
  const message = error.message || 'Something went wrong'
  const stCode = error.status || 500
  res.status(stCode).json({ error: { message } })
}

const normalizeError = (e) => {
  if (e.code === 11000) {
    return createHttpError.Conflict('Email is already exist')
  }
  if (e.name === 'ValidationError') {
    const message = Object.keys(e.errors)
      .map((field) => e.errors[field].message)
      .join('. ')
    return createHttpError.BadRequest(message)
  }
  if (e.name === 'CastError') {
    return createHttpError.BadRequest('Invalid id')
  }
  return e
}
