/* eslint-disable camelcase */
'use strict'
const rp = require('request-promise')
const jwt = require('jwt-simple')

module.exports = config => {
  const baseURL = 'http://kong.stylifier.com:8001'
  return {
    createUser: (username, id) =>
      rp(baseURL + '/consumers/', {
        method: 'POST',
        json: true,
        formData: {
          username: username,
          custom_id: id
        }
      }).catch(e => {
        if (e.statusCode === 409) {
          return Promise.resolve({isCreated: false})
        }
        return e
      }),
    createJWT: username =>
      rp(baseURL + `/consumers/${username}/jwt`, {
        json: true,
        method: 'POST',
        formData: {}
      }).then(r => {
        return {jwt: jwt.encode({iss: r.key}, r.secret, r.algorithm)}
      })
  }
}
