/* eslint-disable camelcase */
'use strict'
const rp = require('request-promise')

module.exports = config => {
  const baseURL = 'https://onesignal.com/api/v1/notifications'
  return {
    send: (ids, message, url) => {
      if (!ids || ids.length <= 0) return Promise.resolve()

      const webIds = ids.filter(o => o.name === 'WEB_NOTIFICATION')
      const iosIds = ids.filter(o => o.name === 'IOS_NOTIFICATION')

      return Promise.all([
        webIds.length > 0 ? rp(baseURL, {
          method: 'POST',
          json: true,
          headers: {
            Authorization: `Basic ${config.token}`
          },
          body: {
            app_id: config.app_id,
            contents: {en: message},
            url: url ? 'https://www.stylifier.com/' + url : '',
            include_player_ids: webIds.map(t => t.id),
            mutable_content: true
          }
        }) : null,
        iosIds.length > 0 ? rp(baseURL, {
          method: 'POST',
          json: true,
          headers: {
            Authorization: `Basic ${config.token}`
          },
          body: {
            app_id: config.app_id,
            contents: {en: message},
            data: url ? {url: 'https://www.stylifier.com/' + url} : {},
            include_player_ids: iosIds.map(t => t.id),
            mutable_content: true
          }
        }) : null
      ])
      .catch(() => Promise.resolve())
    }
  }
}
