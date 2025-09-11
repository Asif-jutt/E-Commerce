const express = require('express');
const router = express.Router();
const asyncwrap = require('../init/asyncwrap');
const { Product } = require('../init/index');
const { Customer } = require('../init/customer');
const islogin = require('../init/isloginadmin');
const {onlyAdmin} = require('../init/isloginadmin');

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
// 

async function order() {
  return await Customer.countDocuments();
}

async function countproduct() {
  const products = await Product.find();
  let count = 0;
  products.forEach((p) => (count += p.stock));
  return count;
}
module.exports = router;