const mongoose = require('mongoose');
const { Schema } = require('mongoose');
const products = require('./product.js');
const passportlocalMongoose = require('passport-local-mongoose');
const adminschema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  
});
adminschema.plugin(passportlocalMongoose);
const Admin = new mongoose.model("Admin", adminschema);
module.exports = { Admin };