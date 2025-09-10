const express = require('express');
const router = express.Router();

router.get('/cookie', (req, res) => {
  res.cookie("Email", "asifhussain5115@gmail.com");
  res.send("This is the cookies");
})

module.exports = router;