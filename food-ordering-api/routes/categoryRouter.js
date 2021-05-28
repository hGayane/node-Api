const express = require('express');

function routes(Restaurant) {

  const categoryRouter = express.Router();

  categoryRouter.route('/category')
   .get((req,res) => {
      return res.json({msg:'inserting categories...'});
   });

   return categoryRouter;
}

module.exports = routes;

