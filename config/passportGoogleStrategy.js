var passport = require('passport');
var GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;

passport.use(new GoogleStrategy({
    clientID:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:1337/auth/google/callback",
    passReqToCallback : true
  },
  function(request, accessToken, refreshToken, profile, done) {
    sails.log.verbose('Google Auth: ', profile)
    var params = {username: profile.email,
                  provider: 'google',
                  protocol: 'oauth2',
                  identifier: profile.id};

    User.findOrCreate({ username: params.username }, { username: params.username })
        .populate('passports')
        .exec(function (err, user) {
      if (err) {
        sails.log.verbose('Google Auth: failed to find or create user ', params.username);
        //res.status(409).send("Failed to create user, maybe already signed up?");
        return done(err, null);
      }
      console.log("passportGoogleStrategy user: ",user);
      Passport.create({ protocol    : params.protocol
                      , provider    : params.provider
                      , identifier  : params.identifier
      }, function (err, passport) {
        if (err) {
          sails.log.verbose('Google Auth: failed to create passport for user ', user.id);
        }

        //res.send(user);
      });

      return done(err, user);
    });
  })
);
