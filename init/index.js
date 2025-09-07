const mongoose = require('mongoose');
const { Schema } = mongoose;
const products = require('./product.js');
const { Review } = require("./review.js");

const ProductSchema = new Schema({
  item: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  image: { type: String, required: true, default: 'https://picsum.photos/seed/p2/200/200' },
  reviews: [{ type: Schema.Types.ObjectId, ref:'Review' }]
});

const CartSchema = new Schema({
  item: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  image: { type: String, required: true }
});

const Product = mongoose.model('Product', ProductSchema);
const Cart = mongoose.model('Cart', CartSchema);

// async function addproduct() {
//   try {
//     await Product.insertMany(products);
//     console.log('Products added Successfully');
//   } catch (err) {
//     console.log(err);
//   }
// }

module.exports = { Product, Cart };
