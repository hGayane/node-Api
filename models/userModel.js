const mongoose = require('mongoose');

const {Schema} = mongoose;

const userModel = new Schema(
  {
    fname : {type:String},
    lname : {type:String},
    email: {type:String},
    gender: {type:String},
	  phoneNumber :  {type:String},
	  address : {type:String},
	  profilePicture : {type:String},
    role: {type:String}
});

module.exports = mongoose.model('User',userModel);