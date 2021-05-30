const mongoose = require('mongoose');
const Category = require('../models/categoryModel');
const User = require('../models/userModel');
const { Schema } = mongoose;
var aggregatePaginate = require('mongoose-aggregate-paginate-v2');


const restaurantModel = new Schema(
	{
		name: { type: String },
		description: { type: String },
		workingHours: { type: String },
		categories: { type: Schema.Types.ObjectId, ref: Category },
		menueItems: [{
			name: { type: String },
			description: { type: String },
			price: { type: Number },
			image: {
				data: { type: Buffer },
				contentType: { type: String }
			}
		}],
		logoImage: {
			data: { type: Buffer },
			contentType: { type: String }
		},
		ratings: [{
			rate: { type: Number },
			ratedBy: { type: Schema.Types.ObjectId, ref: User },
		}],
		reviews: [{
			review: { type: String },
			reviewBy: { type: Schema.Types.ObjectId, ref: User },
		}]
	});

restaurantModel.plugin(aggregatePaginate);
module.exports = mongoose.model('Restaurant', restaurantModel);