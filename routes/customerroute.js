const islogin = require('../init/isloginadmin');
const express = require('express');
const router = express.Router();
const { onlyUser } = require('../init/isloginadmin');
const { Order } = require('../init/order'); // your Order model
const passport = require('passport');

router.get('/user', islogin, async (req, res) => {
 
  const orders = await Order.find({ userId }).populate('products.productId', 'name');
  console.log("Orders:", orders);
  
  res.render('customer', { userId, email, orders });
});


module.exports = router;
