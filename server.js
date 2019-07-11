const express = require('express')
const mongojs = require('mongojs')

// Initialize Express
var app = express()

// Database configuration
var databaseUrl = 'scraper'
var collections = ['scrapedData']

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections)
db.on('error', function (error) {
  throw error
})

// Routes
require('./routes/api_routes')(app)
require('./routes/html_routes')(app)

// Listen on port 3000
const PORT = process.env.PORT || 3000
app.listen(PORT, function () {
  console.log(`App running on port ${PORT}!`)
})
