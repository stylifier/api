/* eslint-disable camelcase */
'use strict'

const rp = require('request-promise')
const JWT = require('jwt-simple')

const PATH_CONSUMERS = '/consumers'
const PATH_JWT = '/jwt'
const API_CALL_TIMEOUT = 5000
const MAX_OPENED_SESSIONS = 5
const KONG_ADMIN_URI = 'http://kong.stylifier.com:8001'

const get_jwts = user =>
rp(`${KONG_ADMIN_URI}${PATH_CONSUMERS}/${user.username}${PATH_JWT}`, {
  json: true,
  timeout: API_CALL_TIMEOUT,
}).then(response => response.data)

const delete_jwt = (user, jwt) =>
rp(`${KONG_ADMIN_URI}${PATH_CONSUMERS}/${user.username}${PATH_JWT}/${jwt.id}`, {
  method: 'DELETE',
  json: true,
  timeout: API_CALL_TIMEOUT,
})

const create_jwt = user =>
rp(`${KONG_ADMIN_URI}${PATH_CONSUMERS}/${user.username}${PATH_JWT}`, {
  method: 'POST',
  json: true,
  timeout: API_CALL_TIMEOUT,
}).then(j => ({jwt: JWT.encode({iss: j.key}, j.secret, j.algorithm)}))

const delete_jwts = user =>
  get_jwts(user)
  .then(js => {
    const jwts = js.sort((a, b) => a.created_at - b.created_at)
    if (jwts.length < MAX_OPENED_SESSIONS) return

    jwts.reduce((t, jwt) =>
      t.then(() => delete_jwt(user, jwt)), Promise.resolve())
  })

const clean_and_create_jwt = user =>
  delete_jwts(user)
  .then(() => create_jwt(user))

const create_consumer = ({id: custom_id, username}) =>
rp(`${KONG_ADMIN_URI}${PATH_CONSUMERS}`, {
  method: 'POST',
  json: true,
  timeout: API_CALL_TIMEOUT,
  body: {username, custom_id},
})

const get_consumer = user =>
  rp(`${KONG_ADMIN_URI}${PATH_CONSUMERS}/${user.username}`, {

    json: true,
    simple: false,
    timeout: API_CALL_TIMEOUT,
  })
  .then(response => (response.id) ?
    response : create_consumer(user).then(() => response))

module.exports = config => {
  return {
    createJWT: (username, id) => get_consumer({username, id})
      .then(() => clean_and_create_jwt({username, id})),
  }
}
