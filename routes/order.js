const express = require('express');
const router = express.Router();
const { Order } = require('../init/order');

router.get('/admin/order', async (req, res) => {
  try {
    const orderdetails = await Order.find(); 
    console.log(orderdetails);
    res.render('order',{ orderdetails });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
