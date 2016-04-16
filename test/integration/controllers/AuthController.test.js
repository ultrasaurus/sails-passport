var assert = require('chai').assert;
var request = require('supertest');

describe('AuthController', function() {
  describe('registering a new user', function() {
    var response;
    beforeEach(function(done) {
      request(sails.hooks.http.app)
        .post('/register')
        .send({ username: 'user1@test.com', password: 'password' })
        .expect(200)
        .expect(function(res) {
          response = res;
        })
        .end(done);
    });
    it('should return user info', function(done) {
      assert.equal(response.body.username, 'user1@test.com');
      assert.equal(response.body.id, 1);
      done();
    });
    it('should save one user', function(done) {
        User.find({ username: 'user1@test.com'})
          .exec(function(err, users) {
            assert.isNull(err)
            assert.equal(users.length, 1)
            done(err);
          })
    });
    it('should save a passport', function(done) {
        User.findOne({ username: 'user1@test.com'})
          .populate('passports')
          .exec(function(err, user) {
            console.log('user:', user)
            assert.isNull(err)
            assert.equal(user.passports.length, 1)
            passport = user.passports[0]
            assert.equal(passport.protocol, 'local')
            done(err);
          })
    });
  });
  describe('with existing user', function() {
    beforeEach(function(done) {
      User.create({ username: 'user1@test.com', password: 'password' }
                  , done);
    });
    it('register should fail', function(done) {
      request(sails.hooks.http.app)
        .post('/register')
        .send({ username: 'user1@test.com', password: 'password' })
        .expect(409, done)
    });
    it('should login successfully', function(done) {
      request(sails.hooks.http.app)
        .post('/login')
        .send({ user: 'user1@test.com', password: 'password' })
        .expect(200, done)
    });
    it('should logout successfully', function(done) {
      request(sails.hooks.http.app)
        .get('/logout')
        .expect(200, done)
    });

  });
});
