const mongoose = require('mongoose');

const {Schema} = mongoose;

const restaurantModel = new Schema(
  {
    name : {type:String},
	  description :  {type:String},
	  categories : {type:String},
	  workingHours : {type:String},
	  logoImage : {type:String},
});

module.exports = mongoose.model('Restaurant',restaurantModel);