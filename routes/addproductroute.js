const express = require('express');
const router = express('Router');
const asyncwrap = require('../init/asyncwrap');
const { Product } = require('../init/index');
const { route } = require('./productroute');
const islogin = require('../init/isloginadmin');
// Add product
router.get(
  '/admin/add',islogin,
  asyncwrap(async (req, res) => {
    res.render('add');
  })
);

router.post(
  '/admin/add',islogin,
  asyncwrap(async (req, res) => {
    const { item, price, stock, image } = req.body;
    await Product({ item, price, stock, image }).save();
    req.flash('success', "Product Add Successfully..");
    res.redirect('/admin');
  })
);
router.get(
  '/',
  asyncwrap(async (req, res) => {
    res.render('main');
  })
);
module.exports = router;