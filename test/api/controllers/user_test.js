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

  describe('/users', function() {
    it('create a user and returns jwt', function(done) {
      request(server)
      .post('/register')
      .send({
        full_name: 'test',
        username: 'test' + (new Date()).getTime(),
        email: 'test@mail.com',
        password: '12345678',
      })
      .set('Accept', 'application/json')
      .end(function(err, res) {
        should.exists(res.body.jwt)
        res.status.should.eql(200)
        done(err)
      })
    })

    describe('creates a user and', function() {
      const password = '12345678'

      let username

      beforeEach(function(done) {
        username = 'test' + (new Date()).getTime()
        request(server)
        .post('/register')
        .send({
          full_name: 'test',
          username: username,
          email: 'test@mail.com',
          password: password,
        })
        .set('Accept', 'application/json')
        .end(function(err, res) {
          done(err)
        })
      })

      it('login a user', function(done) {
        request(server)
        .post('/login')
        .send({
          username: username,
          password: '12345678',
        })
        .set('Accept', 'application/json')
        .end(function(err, res) {
          res.status.should.eql(200)
          should.exists(res.body.jwt)
          done(err)
        })
      })

      it('get brands', function(done) {
        request(server)
        .get('/brands?q=test')
        .set('X-Consumer-Username', username)
        .set('Accept', 'application/json')
        .end(function(err, res) {
          console.log(res.body.data)
          res.status.should.eql(200)
          should.exists(res.body.data)
          done(err)
        })
      })

      it('get brands with pagination', function(done) {
        request(server)
        .get('/brands?q=test&pagination=10')
        .set('X-Consumer-Username', username)
        .set('Accept', 'application/json')
        .end(function(err, res) {
          res.status.should.eql(200)
          should.exists(res.body.data)
          done(err)
        })
      })

      it('get users', function(done) {
        request(server)
        .get('/users?q=test')
        .set('X-Consumer-Username', username)
        .set('Accept', 'application/json')
        .end(function(err, res) {
          res.status.should.eql(200)
          should.exists(res.body.data)
          done(err)
        })
      })

      it('get user by username', function(done) {
        request(server)
        .get(`/users/${username}`)
        .set('X-Consumer-Username', username)
        .set('Accept', 'application/json')
        .end(function(err, res) {
          res.status.should.eql(200)
          res.body.username.should.eql(username)
          done(err)
        })
      })

      it('get self user', function(done) {
        request(server)
        .get('/user/self')
        .set('X-Consumer-Username', username)
        .set('Accept', 'application/json')
        .end(function(err, res) {
          res.status.should.eql(200)
          res.body.username.should.eql(username)
          done(err)
        })
      })
    })
  })
})
