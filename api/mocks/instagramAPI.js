/* eslint-disable camelcase */
'use strict'
const rp = require('request-promise')

module.exports = config => {
  const baseURL = 'https://api.instagram.com'
  return {
    getToken: (code, redirectUrl) =>
      Promise.resolve({
        access_token: '790672642.5818518.ac839b304e2b4cd59ee8d4bad4369257',
        user: {
          id: '790672642',
          username: 'al_kh31',
          profile_picture: 'https://scontent.cdninstagram.com/t51.2885-19/s150x150/11355763_890561537724621_1328082444_a.jpg',
          full_name: 'ali',
          bio: '',
          website: '',
          is_business: false
        }
      }),
    getRecentMedia: token =>
      rp(baseURL + '/v1/users/self/media/recent?access_token=' + token, {
        method: 'GET',
        json: true
      }).then(res => res.data)
  }
}
