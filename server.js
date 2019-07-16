const express = require('express')
const handlebars = require('express-handlebars')
// const mongojs = require('mongojs')
const mongoose = require('mongoose')

// Initialize Express
const app = express()

// Middleware
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static('public'))

// Template engine
app.engine('handlebars', handlebars({
  defaultLayout: 'main',
  helpers: require('./helpers/helpers')
}))
app.set('view engine', 'handlebars')

// Database configuration
// var databaseUrl = 'scraper'
// var collections = ['scrapedData']

// Hook mongojs configuration to the db variable
// var db = mongojs(databaseUrl, collections)
// db.on('error', error => { throw error })

// Connect to the Mongo DB
mongoose.connect('mongodb://localhost/exchange_db', { useNewUrlParser: true })

// Routes
require('./routes/api_routes')(app)
require('./routes/html_routes')(app)

// Listen on port 3000
const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`App running on port ${PORT}!`))
