const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ArticleSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true,
    unique: true
  },
  summary: {
    type: String,
    required: true
  },
  image: String,
  topic: String,
  datetime: Date,
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }]
})

module.exports = mongoose.model('Article', ArticleSchema)
