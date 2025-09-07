const express = require('express');
const router = express.Router();
const asyncwrap = require('../init/asyncwrap');
const { Product, Cart } = require('../init/index');
const { Customer } = require('../init/customer');


router.get(
  '/products/cart/checkout',
  asyncwrap(async (req, res) => {
    const cartItems = await Cart.find();
    // console.log('Cart items:', cartItems);
    res.render('checkout', { cartItems });
  })
);
// remvove
router.post(
  '/products/cart/remove/:id',
  asyncwrap(async (req, res) => {
    await Cart.findByIdAndDelete(req.params.id);
    res.redirect('/products/cart');
}))
router.get(
  '/products/cart',
  asyncwrap(async (req, res) => {
    const prod = await Cart.find();
    const bill = prod.reduce((sum, p) => sum + p.price, 0);
    res.render('cart', { prod, bill });
  })
);

router.get(
  '/products/cart/:id',
  asyncwrap(async (req, res) => {
    const prod = await Product.findById(req.params.id);
    if (!prod) return res.send('Product not found!');
    await Cart({
      item: prod.item,
      price: prod.price,
      stock: prod.stock,
      image: prod.image,
    }).save();
    res.redirect('/products/cart');
  })
);

router.post(
  '/products/cart/checkout',
  asyncwrap(async (req, res) => {
    const { username, email, payment } = req.body;
    const cartItems = await Cart.find();
    if (!cartItems.length)
      return res.send(
        "<script>alert('Cart is empty!'); window.location='/products/cart';</script>"
      );

    await Customer({ username, email, orders: cartItems }).save();
    await Cart.deleteMany({});
    return res.redirect('/products');
  })
);


module.exports = router;
