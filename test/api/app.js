'use strict'

module.exports = function(config) {
  return require('../../app')(config, {
    db: require('../../api/helpers/db'),
    // kong: require('../../api/helpers/kong')(config.kong),
    kong: require('../../api/mocks/kong')(config.kong),
    id: require('uniqid'),
    bcrypt: require('bcrypt'),
    jwt: require('jwt-simple'),
    instagram: require('../../api/helpers/instagramAPI')(config.instagram)
  })
}
