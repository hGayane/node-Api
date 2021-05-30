const express = require('express');
const categporyController = require('../controllers/categoryController');
const User = require('../models/userModel');


function routes(Category, accessTokenSecret, jwt, cache) {
   const controller = categporyController(Category);
   const categoryRouter = express.Router();

   //middleware for jwt auth and admin role
   categoryRouter.use('/category', (req, res, next) => {
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

   categoryRouter.route('/category')
      .post((req, res) => {
         adminActionsAuth(req, res);
         controller.post(req, res);
      })
      .get((req, res) => {
         adminActionsAuth(req, res);
         controller.get(req, res);
      });

   categoryRouter.route('/category/:categoryId')
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

   return categoryRouter;
}

function adminActionsAuth(req, res) {
   try {
      console.log(req.user._id)
      User.findById(req.user._id, (err, user) => {
         console.log(user)
         if (err) {
            return res.send(err);
         }
         if (user)
            if (!user.role || user.role !== 'Admin') {
               res.status(401);
               return res.send('Not Authorised to complete current procedure.');
            }
      })
   } catch (err) {
      res.send(err);
   }
}

module.exports = routes;

