const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

function routes(User, accessTokenSecret) {
  const authRouter = express.Router()
  const cache = require('../memoryCache.js');

  authRouter.post(
    '/auth/signUp',
    async (req, res, next) => {
      try {
        //create user
        const user = new User(req.body);
        if (!req.body.email || !req.body.password) {
          res.status(400);
          return res.send('email and password are required.');
        }
        user.save((err, user) => {
          if (err) {
            res.status(400);
            res.send(err);
          }
          req.login(user, () => {
            res.json(user)
          })
        });
      } catch (error) {
        return next(error);
      }
    });


  authRouter.route('/auth/login',).post(
    passport.authenticate('login', { session: false }),
    async (req, res, next) => {
      const user = req.user;
      try {
        if (!user) {
          const error = new Error('An error occurred.');
          return next(error);
        }

        req.login(
          user,
          { session: false },
          async (error) => {
            if (error) return next(error);

            const body = { _id: user._id, email: user.email };
            const token = jwt.sign({ user: body }, accessTokenSecret);

            return res.json({ token });
          }
        );
      } catch (error) {
        return next(error);
      }
    });

  authRouter.route('/auth/logOut',).get(
    async (req, res, next) => {
      req.logout()
      if (cache) {
        cache.clear();
        console.log(`Memory Cache Cleared.`);
      }
      return res.send('Logged Out.');
    });

  return authRouter;
};

module.exports = routes;