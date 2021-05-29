const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

function routes(User) {
  const authRouter = express.Router()
  const cache = require('../memoryCache.js');

  authRouter.post(
    '/auth/signUp',
    async (req, res, next) => {
      try {
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
      } catch (error) {
        return next(error);
      }
    });


  authRouter.route('/auth/login',).post(
    async (req, res, next) => {
      console.log('here')
      passport.authenticate(
        'login',
        async (err, user, info) => {
          try {
            if (err || !user) {
              const error = new Error('An error occurred.');
              return next(error);
            }
            console.log('logining')

            req.login(
              user,
              { session: false },
              async (error) => {
                if (error) return next(error);

                const body = { _id: user._id, email: user.email };
                const token = jwt.sign({ user: body }, 'TOP_SECRET');

                return res.json({ token });
              }
            );
          } catch (error) {
            return next(error);
          }
        })
    });

  authRouter.post(
    '/auth/logOut',
    async (req, res, next) => {
      req.logout()
      if (cache) {
        cache.clear();
        console.log(`Memory Cache Cleared.`);
      }
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