/* eslint-disable camelcase */
'use strict'

const should = require('should')
const request = require('supertest')

describe('validate route', function() {
  let server

  before(function() {
    const appname = require('../../../package').name
    const config = require('rc')(appname, {})
    server = require('../../../app')(config, {
      db: require('../../../api/helpers/db'),
      // kong: require('../../../api/helpers/kong')(config.kong),
      kong: require('../../../api/mocks/kong')(config.kong),
      id: require('uniqid'),
      bcrypt: require('bcrypt'),
      jwt: require('jwt-simple')
    })
  })

  describe('creates a user and', function() {
    const password = '12345678'
    let usernameFrom
    let usernameTo

    const createUser = (user, cb) => {
      request(server)
      .post('/register')
      .send({
        full_name: 'test',
        username: user,
        email: 'test@mail.com',
        password: password,
      })
      .set('Accept', 'application/json')
      .end(function(err, res) {
        cb(err)
      })
    }

    beforeEach(function(done) {
      usernameFrom = 'test' + (new Date()).getTime()
      createUser(usernameFrom, () => {
        usernameTo = 'test' + (new Date()).getTime()
        createUser(usernameTo, () => done())
      })
    })

    it('create a thread', function(done) {
      request(server)
      .post('/threads')
      .send({to: {username: usernameTo}})
      .set('Accept', 'application/json')
      .set('X-Consumer-Username', usernameFrom)
      .end(function(err, res) {
        res.status.should.eql(200)
        should.exists(res.body.success)
        done(err)
      })
    })

    describe('creates a thread and', function() {
      beforeEach(function(done) {
        request(server)
        .post('/threads')
        .send({to: {username: usernameTo}})
        .set('Accept', 'application/json')
        .set('X-Consumer-Username', usernameFrom)
        .end(function(err, res) {
          res.status.should.eql(200)
          should.exists(res.body.success)
          done(err)
        })
      })

      it('get threads', function(done) {
        request(server)
        .get('/threads')
        .set('X-Consumer-Username', usernameFrom)
        .set('Accept', 'application/json')
        .end(function(err, res) {
          res.status.should.eql(200)
          should.exists(res.body.data)
          done(err)
        })
      })
    })
  })
})
