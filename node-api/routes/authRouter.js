const express = require('express');
const passport = require('passport');

function routes(User) {
  const authRouter = express.Router()

  authRouter.route('/auth/signUp')
    .post((req, res) => {
      //create user
      const user = new User(req.body);
      if (!req.body.userName || !req.body.password) {
        res.status(400);
        return res.send('Username and password are required.');
      }
      user.save();
      req.login(user, () => {
        res.json(user)
      });
    });
  authRouter.route('/auth/signIn')
    .post(
      passport.authenticate('local', {
        successRedirect: '/api/auth/success',
        failureRedirect: '/api/auth/failure',
        failureFlash: true
      })
    );

  authRouter.route('/auth/logOut')
    .get((req, res) => {
        req.logout();
        return res.send('Logged Out.');
    });

  authRouter.route('/auth/success').get((req, res) => {
    res.send('Welcome Resaurant API');
  });

  authRouter.route('/auth/failure').get((req, res) => {
    res.send('Login failed.');
  });

  return authRouter;
};

module.exports = routes;