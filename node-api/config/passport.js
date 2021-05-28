const passport = require('passport');
require('./strategies/local.strategy')();

function passportConfig(app, User) {

  app.use(passport.initialize());
  app.use(passport.session());

  // Stores user in session
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  // Retrives user from session
  passport.deserializeUser((userid, done) => {
    User.findById(userid, (err, user) => {
      done(err, user);
    });
  });

}
module.exports = passportConfig;