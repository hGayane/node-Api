const mongoose = require('mongoose');

const {Schema} = mongoose;

const restaurantModel = new Schema(
  {
    name : {type:String},
	  description :  {type:String},	  
	  workingHours : {type:String},
		categories : {type:String},
		menueItems:[{
			name:{type:String},
			description :{type:String},	
		  price:{type:Number},
			image:{
				data: {type:Buffer},
        contentType: {type:String}
			}
		}],
		logoImage : {
			data: {type:Buffer},
			contentType: {type:String}
		},
});

module.exports = mongoose.model('Restaurant',restaurantModel);