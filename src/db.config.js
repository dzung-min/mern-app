require('dotenv').config()
const mongoose = require('mongoose')

mongoose.connect(process.env.DB_URI)

module.exports = (app, port) => {
  mongoose.connection
    .on('error', () => {
      console.log('MongoDB connection error')
      process.exit(1)
    })
    .once('open', () => {
      app.listen(port, () => {
        console.log(`Server is running on port ${port}`)
      })
    })
}
