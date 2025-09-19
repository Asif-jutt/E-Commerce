const express = require('express');
const router = express.Router();
const asyncwrap = require('../init/asyncwrap');
const { Product } = require('../init/index');
const { Cart, Order } = require('../init/order');
const islogin = require('../init/isloginadmin');

router.get('/user', islogin, async (req, res) => {
  const userId = req.user.id;

  // Fetch all orders for the logged-in user
  const orders = await Order.find({ userId }).sort({ createdAt: -1 });

  res.render('customer', {
    user: req.user.username,
    email: req.user.email,
    orders // pass orders to EJS
  });
});
// Add product to cart
router.get('/products/cart/:id', islogin, asyncwrap(async (req, res) => {
  const userId = req.user.id;
  if (!userId) throw new Error("User not logged in");

  const productId = req.params.id;
  const product = await Product.findById(productId);
  if (!product) throw new Error("Product not found");

  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = new Cart({ userId, items: [] });
  }

  const itemIndex = cart.items.findIndex(item => item.productId.equals(productId));
  if (itemIndex > -1) {
    cart.items[itemIndex].quantity += 1;
  } else {
    cart.items.push({ productId, quantity: 1, price: product.price });
  }

  await cart.save();
  res.redirect('/products/cart');
}));

// View cart
router.get('/products/cart', islogin, asyncwrap(async (req, res) => {
  const userId = req.user.id;
  const cart = await Cart.findOne({ userId }).populate('items.productId');

  if (!cart || cart.items.length === 0)
    return res.render('cart', { prod: [], bill: 0 });

  const bill = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  res.render('cart', { prod: cart.items, bill });
}));

// Remove single item from cart
router.post('/products/cart/remove/:productId', islogin, asyncwrap(async (req, res) => {
  const userId = req.user.id;
  const productId = req.params.productId;

  const cart = await Cart.findOne({ userId });
  if (!cart) return res.redirect('/products/cart');

  cart.items = cart.items.filter(item => !item.productId.equals(productId));
  await cart.save();

  res.redirect('/products/cart');
}));

// 
// Place order
router.post('/products/cart/checkout', islogin, asyncwrap(async (req, res) => {
  const userId = req.user.id;
  const { mobileNumber, deliveryAddress } = req.body;

  if (!mobileNumber || !deliveryAddress)
    return res.send("<script>alert('Please provide phone number and address!'); window.history.back();</script>");

  const cart = await Cart.findOne({ userId }).populate('items.productId');
  if (!cart || cart.items.length === 0)
    return res.send("<script>alert('Cart is empty!'); window.location='/products/cart';</script>");

  const totalAmount = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const products = cart.items.map(item => ({
    productId: item.productId._id,
    quantity: item.quantity,
    price: item.price
  }));

  await Order.create({
    userId,
    products,
    totalAmount,
    deliveryAddress,
    mobileNumber,
    status: "pending"
  });
 
  await Cart.deleteOne({ userId });
  req.flash('success', 'Order book Successfully...');
  res.send("<script>alert('Order placed successfully!'); window.location='/user';</script>");
}));

module.exports = router;
