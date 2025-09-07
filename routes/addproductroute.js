const express = require('express');
const router = express('Router');
const asyncwrap = require('../init/asyncwrap');
const { Product } = require('../init/index');
const { route } = require('./productroute');

// Add product
router.get(
  '/admin/add',
  asyncwrap(async (req, res) => {
    res.render('add');
  })
);

router.post(
  '/admin/add',
  asyncwrap(async (req, res) => {
    const { item, price, stock, image } = req.body;
    await Product({ item, price, stock, image }).save();
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