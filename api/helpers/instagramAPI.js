/* eslint-disable camelcase */
'use strict'
const rp = require('request-promise')

module.exports = config => {
  const baseURL = 'https://api.instagram.com'
  return {
    getToken: code =>
      rp(baseURL + '/oauth/access_token', {
        method: 'POST',
        json: true,
        formData: {
          client_id: process.env.INSTA_CLIENT_ID,
          client_secret: process.env.INSTA_CLIENT_SECRET,
          grant_type: 'authorization_code',
          redirect_uri: config.redirect_uri,
          code: code
        }
      })
      .catch(e => {
        console.log(e.message)
        return Promise.reject('failed to get the token from instagram')
      }),
    getRecentMedia: token =>
      rp(baseURL + '/v1/users/self/media/recent?access_token=' + token, {
        method: 'GET',
        json: true
      }).then(res => res.data)
  }
}
