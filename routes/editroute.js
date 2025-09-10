const express = require('express');
const router = express('Router');
const asyncwrap = require('../init/asyncwrap');
const { Product } = require('../init/index');
const { Review } = require('../init/review');
const islogin = require('../init/isloginadmin');


router.get(
  '/admin/edit/:id',islogin,
  asyncwrap(async (req, res) => {
    const { id } = req.params;
    const prod = await Product.findById(id);
    if (!prod) return res.send('Product not found!');
    res.render('edit.ejs', { prod });
  })
);

router.post(
  '/admin/edit/:id',islogin,
  asyncwrap(async (req, res) => {
    const { id } = req.params;
    const { item, price, stock, image } = req.body;
    const product = await Product.findById(id);
    if (product) {
      product.item = item;
      product.price = Number(price);
      product.stock = Number(stock);
      product.image = image;
      await product.save();
    }
    req.flash('success',"Update Product Successfully...")
    res.redirect('/admin');
  })
);

module.exports = router;