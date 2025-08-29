const mongoose = require('mongoose');
const { Schema } = require('mongoose');
const products = require('./product.js');
// mongoose
//   .connect('mongodb://127.0.0.1:27017/ecommerce')
//   .then(() => console.log('✅ MongoDB Connected'))
//   .catch((err) => console.log('❌ DB Error:', err));
const ProductSchema = new mongoose.Schema({
  item: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
    default: 'https://picsum.photos/seed/p2/200/200',
  },
});

const Product = new mongoose.model('Product', ProductSchema);

async function addproduct() {
  try {
    await Product.insertMany(products);
    console.log('Products added Successfully');
  } catch (err) {
    console.log(err);
  }
}
// addproduct();
module.exports = Product;
