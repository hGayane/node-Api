const express = require('express');
const userController = require('../controllers/userController');

function routes(User) {
  const userRouter = express.Router();
  const controller = userController(User);
  
//middleware for checking loged in
  userRouter.use('/users',(req, res, next) => {
    if (req.user) {
      next();
    } else {
      res.send('Not Authorised. Please login to see restaurants.');
    }
  });

  userRouter.route('/users')
    .get(controller.get);

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