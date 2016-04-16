var Sails = require('sails');
var sails;

before(function(done) {
  Sails.lift({
    log: {
        level: 'error'
      },
      connections: {
        testDB: {
          adapter: 'sails-memory'
        }
      },
      models: {
        connection: 'testDB'
      }
  }, function(err, server)
  {
    sails = server;
    if (err) return done(err);
    done(err, sails);
  });
});

after(function(done)
{
  Sails.lower(done);
});

beforeEach(function(done) {
  // Drops database between each test.  This works because we use
  // the memory database
  sails.once('hook:orm:reloaded', done);
  sails.emit('hook:orm:reload');
});
