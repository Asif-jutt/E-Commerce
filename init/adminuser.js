const mongoose = require('mongoose');
const { Schema } = require('mongoose');
const products = require('./product.js');
// mongoose
//   .connect('mongodb://127.0.0.1:27017/ecommerce')
//   .then(() => console.log('✅ MongoDB Connected'))
//   .catch((err) => console.log('❌ DB Error:', err));
const adminschema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const Admin = new mongoose.model("Admin", adminschema);
module.exports = { Admin };