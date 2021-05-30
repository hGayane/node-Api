const express = require('express');
const userController = require('../controllers/userController');

function routes(User, accessTokenSecret, jwt, cache) {
  const userRouter = express.Router();
  const controller = userController(User);

  //middleware for jwt auth
  userRouter.use('/users', (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
      const token = authHeader.split(' ')[1];

      jwt.verify(token, accessTokenSecret, (err, user) => {
        if (err) {
          return res.sendStatus(403);
        }
        req.user = user.user;
        if (!cache)
          cache = require('../memoryCache.js');
        return next();
      });
    } else {
      res.sendStatus(401);
    }
  });

  //adding middlewre for userRouter
  userRouter.use('/users/:userId', (req, res, next) => {
    User.findById(req.params.userId, (err, user) => {
      if (err) {
        return res.send(err);
      }
      if (user) {
        req.user = user;
        return next();
      }
      return res.sendStatus(404);
    });
  });
  userRouter.route('/users/:userId')
    .get((req, res) => {
      const newUser = req.user.toJSON();

      newUser.links = {};
      newUser.links.FilterByName = `http://${req.headers.host}/api/users?email=${req.user.email}`;

      return res.json(newUser);
    })
    .put((req, res) => {
      const { user } = req;
      user.fname = req.body.fname;
      user.lname = req.body.lname;
      user.email = req.body.email;
      user.gender = req.body.gender;
      user.phoneNumber = req.body.phoneNumber;
      user.address = req.body.address;
      user.role = req.body.role;

      req.user.save((err) => {
        if (err) {
          return res.send(err);
        }
        return res.json(user);
      });
    })
    .patch((req, res) => {
      const { user } = req;

      if (req.body._id) {
        delete req.body._id;
      }
      Object.entries(req.body).forEach((item) => {
        const key = item[0];
        const value = item[1];
        user[key] = value;
      });
      req.user.save((err) => {
        if (err) {
          return res.send(err);
        }
        return res.json(user);
      });
    })
    .delete((req, res) => {
      req.user.remove((err) => {
        if (err) {
          return res.send(err);
        }
        return res.sendStatus(204);//removed
      });
    });

  return userRouter;
}

module.exports = routes;