const express = require('express');
const restaurantController = require('../controllers/restaurantController');
const restaurantMiddleware = require('../middleware/restaurantMiddleware');

 function routes(Restaurant) {
  const restaurantRouter = express.Router();
  const controller = restaurantController(Restaurant);
  const middleware = restaurantMiddleware(Restaurant);

  restaurantRouter.route('/restaurants')
    .post(controller.post)
    .get(controller.get);

  //adding middleware for handling restaurants by id routes
  restaurantRouter.use('/restaurants/:restaurantId', middleware.handleRestaurantRequestById);

  restaurantRouter.route('/restaurants/:restaurantId')
    .get(controller.getById)
    .put(controller.updateDocumentById)
    .patch(controller.updateDocumentFieldsById)
    .delete(controller.deleteDocumentById);

  return restaurantRouter;
}

module.exports = routes;