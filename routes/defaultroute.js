const express = require('express');
const router = express.Router();
const asyncwrap = require('../init/asyncwrap');
const { defaultresponse } = require('../views/deflauthandler');


router.use((req, res) => res.send(defaultresponse));

// Error handler
router.use((err, req, res, next) => {
  const { status = 404, message = 'Something went wrong!' } = err;
  res.status(status).send(message);
});

module.exports = router;