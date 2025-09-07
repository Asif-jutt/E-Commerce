const express = require('express');
const Router = express('Router');
const asyncwrap = require('../init/asyncwrap');
const { Product } = require('../init/index');

Router.get(
  '/products',
  asyncwrap(async (req, res) => {
    const products = await Product.find();
    res.render('home.ejs', { products });
  })
);

module.exports = Router;