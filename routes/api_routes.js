const axios = require('axios')
const cheerio = require('cheerio')

var db = require('../models')

module.exports = function (app) {
  app.get('/scrape', function (req, res) {
    axios.get('https://old.reddit.com/')
      .then(response => {
        const $ = cheerio.load(response.data)
        const results = []
        $('.thing').each((i, element) => {
          const result = {}
          result.title = $(element)
            .find('a.title')
            .text()
          result.link = $(element).data('url')
          result.image = $(element)
            .find('img')
            .attr('src')
          result.timestamp = $(element).data('timestamp')
          results.push(result)
          db.Article.create(result)
            .then(dbArticle => console.log(dbArticle))
            .catch(error => console.log(error))
        })
        return res.json(results)
      })
      .catch(error => {
        res.status(500).end() // Internal Server Error
        throw error
      })
  })

  app.get('/clear', function (req, res) {
    db.Article.deleteMany({})
      .then(() => res.status(200).end())
      .catch(error => {
        res.status(500).end() // Internal Server Error
        throw error
      })
  })

  app.post('/articles/:id', function (req, res) {
    db.Comment.create(req.body)
      .then(dbComment => {
        return db.Article.findOneAndUpdate({
          _id: req.params.id
        }, {
          comment: dbComment._id
        }, {
          new: true
        })
      })
      .then(dbArticle => res.json(dbArticle))
      .catch(error => {
        res.status(500).end() // Internal Server Error
        throw error
      })
  })
}
