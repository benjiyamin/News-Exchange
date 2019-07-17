const url = require('url')
const request = require('request')

const db = require('../models')

module.exports = function (app) {
  app.get('/', (req, res) => {
    const hostname = req.headers.host // hostname = 'localhost:8080'
    const pathname = '/api/scrape'
    const fullUrl = new url.URL(`http://${hostname}${pathname}`).href
    request(fullUrl, error => {
      if (error) {
        res.status(500).end() // Internal Server Error
        throw error
      } else {
        db.Article.find({})
          .then(dbArticles => res.render('index', { articles: dbArticles }))
          .catch(error => {
            res.status(500).end() // Internal Server Error
            throw error
          })
      }
    })
  })
}
