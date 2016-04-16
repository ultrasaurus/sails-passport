var chai = require("chai");
var assert = chai.assert;

var request = require('supertest');

describe('home page', function() {
  var response;
  beforeEach(function(done) {
    request(sails.hooks.http.app)
      .get('/')
      .expect(200)
      .expect(function(res) {
        response = res;
      })
      .end(done);
  });

  it('should have some expected text', function(done) {
    assert.include(response.text, 'Welcome');
    done();
  });
});
