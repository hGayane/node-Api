function restaurantMiddleware(Restaurant) {

  function handleRestaurantRequestById(req, res, next) {
    Restaurant.findById(req.params.restaurantId, (err, restaurant) => {
      
      //check if logged in
      //for put,patch,add,delete documents routes need to check if role is admin

      if (err) {
        return res.send(err);
      }
      if (restaurant) {
        req.restaurant = restaurant;
        return next();
      }
      return res.sendStatus(404);
    });
  };

  return { handleRestaurantRequestById };
}

module.exports = restaurantMiddleware;