const express = require('express');
const restaurantController = require('../controllers/restaurantController');

function routes(Restaurant) {
  const restaurantRouter = express.Router();
  const controller = restaurantController(Restaurant);

  restaurantRouter.route('/restaurants')
    .post(controller.post)
    .get(controller.get);

  //adding middlewre for restaurantRouter
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

  restaurantRouter.route('/restaurants/:restaurantId')
    .get((req, res) => res.json(req.restaurant))
    .put((req, res) => {
      const { restaurant } = req;
      restaurant.name = req.body.name;
      restaurant.description = req.body.description;
      restaurant.categories = req.body.categories;
      restaurant.workingHours = req.body.workingHours;
      restaurant.logoImage = req.body.logoImage;
      req.restaurant.save((err) => {
        if (err) {
          return res.send(err);
        }
        return res.json(restaurant);
      });
    })
    .patch((req, res) => {
      const { restaurant } = req;

      if (req.body._id) {
        delete req.body._id;
      }
      Object.entries(req.body).forEach((item) => {
        const key = item[0];
        const value = item[1];
        restaurant[key] = value;
      });
      req.restaurant.save((err) => {
        if (err) {
          return res.send(err);
        }
        return res.json(restaurant);
      });
    })
    .delete((req,res) => {
        req.restaurant.remove((err) => {
          if(err){
           return res.send(err);
          }
          return res.sendStatus(204);//removed
        });
    });

  return restaurantRouter;
}

module.exports = routes;