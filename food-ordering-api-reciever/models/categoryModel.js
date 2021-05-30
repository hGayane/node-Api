const mongoose = require('mongoose');
var aggregatePaginate = require('mongoose-aggregate-paginate-v2');

const { Schema } = mongoose;

const categoryModel = new Schema(
  {
    name: { type: String , required: true, unique: true},
    description: { type: String },
  });

categoryModel.plugin(aggregatePaginate);
module.exports = mongoose.model('Category', categoryModel);