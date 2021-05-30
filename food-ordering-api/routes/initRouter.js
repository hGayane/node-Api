const express = require('express');
const {MongoClient} = require('mongodb');
const debug = require('debug')('app:adminRouter');
const restaurants = require('../restaurants.js')
const categories = require('../categories.js')
const users = require('../users.js')


function routes() {
   const initRouter = express.Router();

   initRouter.route('/init')
      .get((req, res) => {
         const url = 'mongodb://localhost';
         const dbName = 'restausrantsApi';

         (async function mongo() {
            let client;
            try {
               client = await MongoClient.connect(url);
               debug('Conected to servier.');

               const db = client.db(dbName);
              // await db.collection('users').insertMany(users);
               await db.collection('categories').insertMany(categories);
               await db.collection('restaurants').insertMany(restaurants);

               return res.send(`Created ${dbName} db and  inserted into collections.`);
            } catch (err) {
                  debug(err.stack);
            }
            client.close()
         }());
        
      });

   return initRouter;
}

module.exports = routes;

