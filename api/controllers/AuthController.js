'use strict';

var passport = require('passport');

module.exports = {
  register: function (req, res) {
    var params = {username: req.body.username, password: req.body.password};

    User.create(params).exec(function(err, user) {
      if (err) {
        sails.log.verbose('register: failed to create user ', params.username);
        res.status(409).send("Failed to create user, maybe already signed up?");
        return;
      }

      Passport.create({ protocol    : 'local'
      , password    : params.password
      , user        : user.id
      }, function (err, passport) {
        if (err) {
          sails.log.verbose('register: failed to create passport for user ', user.id);
          return user.destroy(function (destroyErr) {
            done(destroyErr || err);
          });
        }

        res.send(user);
      });
    });
  },

  login: function (req, res, next) {
    passport.authenticate('local', {failureRedirect: '/login'}, function (err, user, response) {
      if (err) {
        return next(err);
      }

      if (user) {
        res.json(response);
      }
      else {
        res.json({message: 'Bad username/password combination'});
      }
    })(req, res, next);
  },

  logout: function (req, res) {
    delete req.logout();
    res.json({success: true})
  },

  provider: function (req, res, next) {
    sails.log.verbose('provider:', req.param('provider') );
    passport.authenticate('google', { scope :
      [ 'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile'],
        accessType: 'online',
        approval_prompt: 'auto'
    })(req, res, next);
  },

  callback: function (req, res, next) {
    sails.log.verbose('callback (provider action):', req.param('provider'), req.param('action')  );

    passport.authenticate( 'google', {
        successRedirect: '/',
        failureRedirect: '/error'
    })(req, res, next);
  }
}
