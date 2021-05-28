const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 3001;

const db = mongoose.connect('mongodb://localhost/restausrantsApi');

require('./models/restaurantModel')();
require('./consumers/restaurantConsumer')();

app.server = app.listen(port, () => {
  console.log(`Running on port ${port}`);
});