const express = require('express');

function routes(Category, accessTokenSecret, jwt, cache) {

   const categoryRouter = express.Router();

   //middleware for jwt auth and admin role
   categoryRouter.use('/restaurants', (req, res, next) => {
      const authHeader = req.headers.authorization;

      if (authHeader) {
         const token = authHeader.split(' ')[1];

         jwt.verify(token, accessTokenSecret, (err, user) => {
            if (err) {
               return res.sendStatus(403);
            }
            req.user = user;
            adminActionsAuth(req, res);

            if (!cache)
               cache = require('../memoryCache.js');
            next();
         });
      } else {
         res.sendStatus(401);
      }
   });


   categoryRouter.route('/category')
      .get((req, res) => {
         return res.json({ msg: 'inserting categories...' });
      });

   return categoryRouter;
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

