const passport = require('passport');
const { Strategy } = require('passport-local');

 function passportConfig(app, User) {

  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    'login',
    new Strategy(
      {
        usernameField: 'email',
        passwordField: 'password'
      },
      async (email, password, done) => {
        try {
          const user = await User.findOne({ email });
          console.log(`passport ${user}`)

          if (!user) {
            return done(null, false, { message: 'User not found' });
          }
          const validate = await user.isValidPassword(password);
          if (!validate) {
            return done(null, false, { message: 'Wrong Password' });
          }
          return done(null, user, { message: 'Logged in Successfully' });
        } catch (error) {
          return done(error);
        }
      }));
}
module.exports = passportConfig;