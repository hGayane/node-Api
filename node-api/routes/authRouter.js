const express = require('express');
const debug = require('debug')('app:authRouter');

function routes() {
  const authRouter = express.Router()

  authRouter.route('/signUp')
    .post((req, res) => {

    });
  return authRouter;
};


module.exports = routes;