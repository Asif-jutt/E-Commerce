const mongoose = require('mongoose');
const { Schema } = require('mongoose');
const products = require('./product.js');
const { Cart } = require("./index.js");
// mongoose
//   .connect('mongodb://127.0.0.1:27017/ecommerce')
//   .then(() => console.log('✅ MongoDB Connected'))
//   .catch((err) => console.log('❌ DB Error:', err));
const CustomerSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  email: {
    type: String,
  },
  orders: [{
    type: Schema.Types.ObjectId,
    ref: 'Cart'
  }]
});
const Customer = new mongoose.model("Customer", CustomerSchema);
module.exports = { Customer };