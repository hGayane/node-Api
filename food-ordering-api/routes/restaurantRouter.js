const express = require('express');
const restaurantController = require('../controllers/restaurantController');
const User = require('../models/userModel');

const mongoose = require('mongoose');

function routes(Restaurant, accessTokenSecret, jwt, cache) {
  const restaurantRouter = express.Router();
  const controller = restaurantController(Restaurant);

  //adding middleware for handling restaurants by id routes
  restaurantRouter.use('/restaurants/:restaurantId', (req, res, next) => {

    Restaurant.findById(req.params.restaurantId, (err, restaurant) => {
      if (err) {
        return res.send(err);
      }
      if (restaurant) {
        req.data = restaurant;
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
        req.user = user.user;
        if (!cache)
          cache = require('../memoryCache.js');
        return next();
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
      if (!req.body._id)
        req.body._id = req.params.restaurantId;
      controller.updateDocumentById(req, res);
    })
    .patch((req, res) => {
      adminActionsAuth(req, res);
      if (!req.body._id)
        req.body._id = req.params.restaurantId;
      controller.updateDocumentFieldsById(req, res);
    })
    .delete((req, res) => {
      adminActionsAuth(req, res);
      controller.deleteDocumentById(req, res);
    });

  restaurantRouter.route('/restaurants/:restaurantId/menu')
    .post((req, res) => {

      adminActionsAuth(req, res);

      if (req.data.menueItems.length > 0) {
        const existingMenue = req.data.menueItems.filter(m => m.name === req.body.name);
        if (existingMenue)
          res.send(`Menu with the ${existingMenue.name} name exists.`)
      }
      req.data.menueItems.push(req.body);
      controller.addMenueToRestaurant(req, res);
    })

  restaurantRouter.route('/restaurants/:restaurantId/rate')
    .post((req, res) => {
      req.data.ratings.push({
        rate: req.body.rate,
        ratedBy: req.user._id
      });
 
      controller.rateRestaurant(req, res);
    });

  restaurantRouter.route('/restaurants/:restaurantId/review')
    .post((req, res) => {
      req.data.reviews.push({
        review: req.body.review,
        reviewBy: req.user._id
      });
      console.log(req.data.reviews);
      controller.reviewRestaurant(req, res);
    })

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