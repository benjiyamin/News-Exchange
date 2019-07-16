var db = require('../models')

module.exports = function (app) {
  app.get('/', (req, res) => {
    db.Article.find({})
      .then(dbArticles => res.render('index', { articles: dbArticles }))
      .catch(error => {
        res.status(500).end() // Internal Server Error
        throw error
      })
  })
}
