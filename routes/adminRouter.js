const express = require('express');

function routes(){
  const adminRouter = express.Router();

   adminRouter.route('/admin')
   .get((req,res) => {
      return res.json({msg:'inserting restaurants...'});
   });

   return adminRouter;
}

module.exports = routes;

