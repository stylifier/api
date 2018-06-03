/* eslint-disable camelcase */
'use strict'
const rp = require('request-promise')

module.exports = () => {
  const baseURL = 'https://api.pinterest.com/v1'
  const getUserInfo = token =>
    rp(baseURL + '/me/?fields=first_name%2Cid%2Clast_name%2Curl%2Cusername%2Ccounts%2Caccount_type%2Cbio%2Cimage&access_token=' + token, {
      method: 'GET',
      json: true
    }).then(res => res.data)

  return {
    getToken: code =>
      rp(baseURL + `/oauth/token?grant_type=authorization_code&client_id=${process.env.PINTEREST_CLIENT_ID}&client_secret=${process.env.PINTEREST_CLIENT_SECRET}&code=${code}`, {
        method: 'POST',
        json: true
      })
      .then(token =>
        getUserInfo(token.access_token)
        .then(user => Object.assign(user, {access_token: token.access_token})))
      .catch(e => {
        console.log(e)
        return Promise.reject('failed to get the token from pinterest')
      }),
    getMedia: token =>
      rp(baseURL + '/me/pins/?fields=id%2Clink%2Cnote%2Curl%2Cattribution%2Cmedia%2Cmetadata%2Coriginal_link%2Ccounts%2Ccolor%2Cboard%2Ccreator%2Ccreated_at%2Cimage&access_token=' + token, {
        method: 'GET',
        json: true
      })
      .then(res => res.data)
      .then(media => media.filter(m => m.media && m.media.type && m.media.type === 'image'))
      .then(media => media.map(m => ({
        id: m.id,
        images: {
          low_resolution: {
            height: m.image.original.height,
            url: m.image.original.url,
            width: m.image.original.width
          },
          thumbnail: {
            height: m.image.original.height,
            url: m.image.original.url,
            width: m.image.original.width
          },
          standard_resolution: {
            height: m.image.original.height,
            url: m.image.original.url,
            width: m.image.original.width
          }
        },
        style:
          (m.board && m.board.name && /(look|style)/g.test(m.board.name)) ?
          m.board.name.replace(/(look|style)/g, '').trim() :
          undefined,
        type: 'image'
      })))
  }
}
