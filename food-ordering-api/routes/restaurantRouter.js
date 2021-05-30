const express = require('express');
const restaurantController = require('../controllers/restaurantController');
const User = require('../models/userModel');

function routes(Restaurant, accessTokenSecret, jwt,cache) {
  const restaurantRouter = express.Router();
  const controller = restaurantController(Restaurant);

  //adding middleware for handling restaurants by id routes
  restaurantRouter.use('/restaurants/:restaurantId', (req, res, next) => {
    Restaurant.findById(req.params.restaurantId, (err, restaurant) => {
      if (err) {
        return res.send(err);
      }
      if (restaurant) {
        req.restaurant = restaurant;
        return next();
      }
      return res.sendStatus(404);
    });
  });

  //middleware for jwt auth
  restaurantRouter.use('/restaurants', (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
      const token = authHeader.split(' ')[1];

      jwt.verify(token, accessTokenSecret, (err, user) => {
        if (err) {
          return res.sendStatus(403);
        }
        req.user = user;
        if (!cache)
          cache = require('../memoryCache.js');
        next();
      });
    } else {
      res.sendStatus(401);
    }
  });


  restaurantRouter.route('/restaurants')
    .post((req, res) => {
      adminActionsAuth(req, res);
      controller.post(req, res);
    })
    .get(controller.get);

  restaurantRouter.route('/restaurants/:restaurantId')
    .get(controller.getById)
    .put((req, res) => {
      adminActionsAuth(req, res);
      controller.updateDocumentById(req, res);
    })
    .patch((req, res) => {
      adminActionsAuth(req, res);
      controller.updateDocumentFieldsById(req, res);
    })
    .delete((req, res) => {
      adminActionsAuth(req, res);
      controller.deleteDocumentById(req, res);
    });

  return restaurantRouter;
}

function adminActionsAuth(req, res) {
  User.findById(req.user._id, (err, user) => {
    if (err) {
      return res.send(err);
    }
    if (user)
      if (!user.role || user.role !== 'Admin') {
        res.status(401);
        return res.send('Not Authorised to complete current procedure.');
      }
  })
}

module.exports = routes;