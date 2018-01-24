/* eslint-disable camelcase */
'use strict'
const rp = require('request-promise')

module.exports = config => {
  const baseURL = 'https://onesignal.com/api/v1/notifications'
  return {
    send: (ids, message, url) =>
      (ids && ids.length > 0) ?
      rp(baseURL, {
        method: 'POST',
        json: true,
        headers: {
          Authorization: `Basic ${config.token}`
        },
        body: {
          app_id: config.app_id,
          contents: {en: message},
          url: url ? 'https://www.stylifier.com/' + url : '',
          include_player_ids: ids,
          mutable_content: true
        }
      }) : Promise.resolve()
      .catch(t => console.log(t) && Promise.resolve())
  }
}
