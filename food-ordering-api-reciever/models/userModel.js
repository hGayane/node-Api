const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { Schema } = mongoose;

const UserModel = new Schema(
  {
    password: { type: String, required: true,},
    fname: { type: String },
    lname: { type: String },
    email: { type: String, required: true, unique: true },
    gender: { type: String },
    phoneNumber: { type: String },
    address: { type: String },
    profilePicture: {
      data: { type: Buffer },
      contentType: { type: String }
    },
    role: { type: String }
  });

  UserModel.pre(
    'save',
    async function(next) {
      const user = this;
      const hash = await bcrypt.hash(this.password, 10);
  
      this.password = hash;
      next();
    }
  );

  UserModel.methods.isValidPassword = async function(password) {
    const user = this;
    const compare = await bcrypt.compare(password, user.password);
  
    return compare;
  }

module.exports = mongoose.model('User', UserModel);