const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserModel = new Schema(
  {
    fname: { type: String },
    lname: { type: String },
    email: { type: String },
    gender: { type: String },
    phoneNumber: { type: String },
    address: { type: String },
    profilePicture: {
      data: { type: Buffer },
      contentType: { type: String }
    },
    role: { type: String }
  });
const index = UserModel.indexes({ email: 1, phoneNumber: 1 }, { unique: true });

module.exports = mongoose.model('User', {UserModel,index});