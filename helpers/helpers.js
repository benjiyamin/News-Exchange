const helpers = require('handlebars-helpers')(['string', 'date'])

helpers.section = function (name, options) {
  if (!this._sections) this._sections = {}
  this._sections[name] = options.fn(this)
  return null
}

module.exports = helpers
