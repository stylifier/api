'use strict'

module.exports = function(dependencies) {
  return {
    get: function(req, res, next) {
      throw new Error('not implemented')
    }
  }
}
