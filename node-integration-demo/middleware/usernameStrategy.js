const passport = require('passport');
const CustomStrategy = require('passport-custom');

const { createUser } = require('../util/db.js');

passport.use('username', new CustomStrategy(async function(req, done) {
  try {
    let user = await createUser(req.body.username);
    done(null, user);
  } catch(e) {
    done(e);
  }
}));

passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(user, done) {
	done(null, user);
});