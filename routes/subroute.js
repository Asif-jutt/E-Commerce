  const express = require('express');
  const router = express.Router();
  const asyncwrap = require('../init/asyncwrap');
  const sendEmail = require('../email');
  require('dotenv').config();


  router.get(
    '/sub',
    asyncwrap(async (req, res) => {
      const { email } = req.query;
      if (!email) {
        return res.send(
          "<script>alert('Please enter a valid email!'); window.location='/';</script>"
        );
      }
      await sendEmail(email);
      res.send(
        "<script>alert('Subscription successful! Check your email!'); window.location='/';</script>"
      );
    })
  );

  module.exports = router;
