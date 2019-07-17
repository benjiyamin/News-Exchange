const axios = require('axios')
const cheerio = require('cheerio')

var db = require('../models')

module.exports = function (app) {
  app.get('/api/scrape', function (req, res) {
    axios.get('https://www.npr.org/sections/news/')
      .then(response => {
        const $ = cheerio.load(response.data)
        const results = []
        $('article.item').each((i, element) => {
          const result = {}
          result.title = $(element)
            .find('.title')
            .text()
          result.link = $(element)
            .find('.title > a')
            // .first()
            .attr('href')
          result.summary = $(element)
            .find('.teaser')
            .text()
          result.image = $(element)
            .find('img')
            .attr('src')
          result.topic = $(element)
            .find('.slug')
            .text()
          result.datetime = $(element)
            .find('time')
            .attr('datetime')
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

  app.get('/api/clear', function (req, res) {
    db.Article.deleteMany({})
      .then(() => res.status(200).end())
      .catch(error => {
        res.status(500).end() // Internal Server Error
        throw error
      })
  })

  app.post('/api/articles/:id', function (req, res) {
    db.Comment.create(req.body)
      .then(dbComment => {
        return db.Article.findOneAndUpdate({
          _id: req.params.id
        }, {
          $push: { comments: dbComment._id }
        }, {
          new: true
        })
      })
      .then(dbArticle => { return dbArticle.populate('comments').execPopulate() })
      .then(dbArticle => res.json(dbArticle))
      .catch(error => {
        res.status(500).end() // Internal Server Error
        throw error
      })
  })

  app.get('/api/articles', function (req, res) {
    db.Article.find({})
      .populate('comments')
      .then(dbArticles => res.json(dbArticles))
      .catch(error => {
        res.status(500).end() // Internal Server Error
        throw error
      })
  })
}
