const express = require('express');
const restaurantController = require('../controllers/restaurantController');
const restaurantMiddleware = require('../middleware/restaurantMiddleware');

function routes(Restaurant) {
  const restaurantRouter = express.Router();
  const controller = restaurantController(Restaurant);
  const middleware = restaurantMiddleware(Restaurant);

  //middleware for checking loged in
  restaurantRouter.use('/restaurants', (req, res, next) => {
    if (req.user) {
      next();
    } else {
      res.status(401);
      res.send('Not Authorised. Please login to be able to proceed');
    }
  }); 

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

  restaurantRouter.route('/restaurants')
    .post((req, res) => {
      adminActionsAuth(req, res);
      controller.post(req,res);
    })
    .get(controller.get);

  restaurantRouter.route('/restaurants/:restaurantId')
    .get(controller.getById)
    .put((req, res) => {
      adminActionsAuth(req, res);
      controller.updateDocumentById(req,res);
    })
    .patch((req, res) => {
      adminActionsAuth(req, res);
      controller.updateDocumentFieldsById(req,res);
    })
    .delete((req, res) => {
      adminActionsAuth(req, res);
      controller.deleteDocumentById(req,res);
    });

  return restaurantRouter;
}

function adminActionsAuth(req, res) {
  console.log(req.user.role)
  if (!req.user.role || req.user.role !== 'Admin') {
    res.status(401);
    return res.send('Not Authorised to complete current procedure.');
  }
}

module.exports = routes;