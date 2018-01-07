'use strict'
const rp = require('request-promise')
const jwt = require('jwt-simple')

module.exports = (config) => {
  return {
    createUser: (username, id) => 
      rp('http://kong.stylifier.com:8001/consumers/', {
        method: 'POST',
        json: true,
        formData: {
          username: username,
          custom_id: id
        }
      }),
    createJWT: (username) => 
      rp(`http://kong.stylifier.com:8001/consumers/${username}/jwt`, {
        json: true,
        method: 'POST',
        formData: {}
      }).then((r) => {
        return {jwt: jwt.encode({iss: r.key}, r.secret, r.algorithm)}
      })
  }
}