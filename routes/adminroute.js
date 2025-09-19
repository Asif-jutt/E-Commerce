const express = require('express');
const router = express.Router();
const asyncwrap = require('../init/asyncwrap');
const { Product } = require('../init/index');
const { Customer } = require('../init/customer');
const islogin = require('../init/isloginadmin');
const {onlyAdmin} = require('../init/isloginadmin');
const {Order} = require('../init/order');


router.get(
  '/admin',islogin,onlyAdmin,
  asyncwrap(async (req, res) => {
    const totalorder = await order();
    const count = await countproduct();
    const products = await Product.find();
    res.render('admin', { products, count, totalorder });
  })
);


router.get(
  '/admin/delete/:id',islogin,
  asyncwrap(async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    req.flash('delprod', 'Product Deleted successfully...');
    res.redirect('/admin');
  })
);
// coustomer and their orders
router.get('/admin/customer', islogin, asyncwrap(async (req, res, next) => {
  const orders = await Order.find()
    .populate('userId', 'username email')   // fetch customer details
    .populate('products.productId', 'item price image'); // fetch product details
  res.render('customerorders', { orders });
}));

// reg user
router.get('/admin/reguser',islogin, asyncwrap(async (req, res, next) => {
  const user = await Customer.find();
  res.render('reguser',{user});
}))


async function order() {
  return await Order.countDocuments();
}

async function countproduct() {
  const products = await Product.find();
  let count = 0;
  products.forEach((p) => (count += p.stock));
  return count;
}
module.exports = router;