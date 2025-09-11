const express = require('express');
const router = express.Router();
const islogin = require('../init/isloginadmin');
const { onlyUser }  = require('../init/isloginadmin');
router.get('/user',islogin,onlyUser, (req, res) => {
  res.render('customer');
})

module.exports = router;