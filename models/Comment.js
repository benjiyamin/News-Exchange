const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CommentSchema = new Schema({
  title: String,
  body: String
})

module.exports = mongoose.model('Comment', CommentSchema)
