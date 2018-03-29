/* eslint-disable camelcase */
'use strict'

const should = require('should')
const request = require('supertest')
const path = require('path')

describe('validate route', function() {
  let server

  before(function() {
    const appname = require('../../../package').name
    const config = require('rc')(appname, {})
    server = require('../app')(config)
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

    it('create a media', function(done) {
      this.timeout(5000)
      request(server)
      .post('/media')
      .attach('qqfile', path.join(__dirname, '../../fixtures/d42e0091-2c67-437b-987c-296661c0dc3e.jpg'))
      .set('Accept', 'application/json')
      .set('X-Consumer-Username', usernameFrom)
      .end(function(err, res) {
        res.status.should.eql(200)
        should.exists(res.body)
        should.exists(res.body.success)
        done(err)
      })
    })

    describe('creates a media and', function() {

      beforeEach(function(done) {
        this.timeout(5000)
        request(server)
        .post('/self_media')
        .attach('qqfile', path.join(__dirname, '../../fixtures/d42e0091-2c67-437b-987c-296661c0dc3e.jpg'))
        .set('Accept', 'application/json')
        .set('X-Consumer-Username', usernameFrom)
        .end(function(err, res) {
          res.status.should.eql(200)
          should.exists(res.body)
          done(err)
        })
      })

      it('get self media', function(done) {
        this.timeout(5000)
        request(server)
        .get('/self_media')
        .set('Accept', 'application/json')
        .set('X-Consumer-Username', usernameFrom)
        .end(function(err, res) {
          res.status.should.eql(200)
          should.exists(res.body)
          should.exists(res.body)
          should.exists(res.body.data)
          done(err)
        })
      })

      it('get self media with pagination', function(done) {
        this.timeout(5000)
        request(server)
        .get('/self_media?pagination=1')
        .set('Accept', 'application/json')
        .set('X-Consumer-Username', usernameFrom)
        .end(function(err, res) {
          res.status.should.eql(200)
          should.exists(res.body)
          should.exists(res.body.data)
          res.body.data.length.should.eql(0)
          res.body.pagination.should.eql(1)
          done(err)
        })
      })

      it('get someone else media with pagination', function(done) {
        this.timeout(5000)
        request(server)
        .get(`/users/${usernameFrom}/self_media?pagination=1`)
        .set('Accept', 'application/json')
        .set('X-Consumer-Username', usernameFrom)
        .end(function(err, res) {
          res.status.should.eql(200)
          should.exists(res.body)
          should.exists(res.body.data)
          res.body.data.length.should.eql(0)
          res.body.pagination.should.eql(1)
          done(err)
        })
      })

      it('get someone else media', function(done) {
        this.timeout(5000)
        request(server)
        .get(`/users/${usernameFrom}/media`)
        .set('Accept', 'application/json')
        .set('X-Consumer-Username', usernameFrom)
        .end(function(err, res) {
          res.status.should.eql(200)
          should.exists(res.body)
          should.exists(res.body.data)
          done(err)
        })
      })
    })
  })
})
