/* eslint-disable camelcase */
'use strict'
const rp = require('request-promise')

module.exports = secretKey => {
  const baseURL = 'https://api.stripe.com/v1'
  return {
    createCharge: ({amount, currency, description, source}) =>
      rp(baseURL + '/charges', {
        json: true,
        method: 'POST',
        form: {amount, currency, description, source},
        headers: {
          Authorization: 'Bearer ' + secretKey
        }
      }),
    createRefund: (charge, amount) =>
      rp(baseURL + '/refunds', {
        json: true,
        method: 'POST',
        form: {charge: charge.id, amount},
        headers: {
          Authorization: 'Bearer ' + secretKey
        }
      })
  }
}
