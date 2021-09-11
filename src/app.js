require('dotenv').config()
const path = require('path')
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')

const connectDb = require('./db.config')
const apiRouter = require('./routes/api')
const authRouter = require('./routes/auth')
const errorHandler = require('./middlewares/errorHandler')

const ENV = process.env.NODE_ENV || 'development'
const PORT = process.env.PORT || 5000
const app = express()

if (ENV === 'development') app.use(morgan('dev'))

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())
app.use(helmet())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/api', apiRouter)
app.use('/auth', authRouter)

app.use(errorHandler.notFound)
app.use(errorHandler.gereric)

connectDb(app, PORT)
