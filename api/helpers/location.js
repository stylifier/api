/* eslint-disable camelcase */
'use strict'
const geoip = require('geoip-lite')

module.exports = () => ({
  getCountryCode: ip => new Promise(accept => {
    accept(geoip.lookup(ip).country)
  })
})
