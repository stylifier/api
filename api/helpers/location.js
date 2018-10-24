/* eslint-disable camelcase */
'use strict'
const iplocation = require('iplocation').default

module.exports = () => {
  return {
    getCountryCode: ip =>
      iplocation(ip)
        .then(res => res && res.countryCode ? res.countryCode : '')
        .catch(() => Promise.resolve(''))
  }
}
