const express = require('express')
const handlebars = require('express-handlebars')
const logger = require('morgan')
const mongoose = require('mongoose')

// Initialize Express
const app = express()

// Middleware
app.use(logger('dev')) // Use morgan logger for logging requests
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static('public'))

// Template engine
app.engine('handlebars', handlebars({
  defaultLayout: 'main',
  helpers: require('./helpers/helpers')
}))
app.set('view engine', 'handlebars')

// Connect to the Mongo DB
mongoose.connect('mongodb://localhost/exchange_db', { useNewUrlParser: true })

// Routes
require('./routes/api_routes')(app)
require('./routes/html_routes')(app)

// Listen on port 3000
const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`App running on port ${PORT}!`))
