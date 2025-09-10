const express = require('express');
const router = express.Router();
const sendMessageFromUser = require('../init/contactemail');
const asyncwrap = require('../init/asyncwrap');

// contact us
router.get(
  '/contact',
  asyncwrap(async (req, res) => {
    res.render('contact');
  })
);
// contact email
router.post(
  '/contact',
  asyncwrap(async (req, res) => {
    const { name, email, subject, message } = req.body;
    console.log(req.body);

    if (!email || !message) {
      return res.send(
        "<script>alert('Please fill all fields!'); window.location='/contact';</script>"
      );
    }

    await sendMessageFromUser({ userEmail: email, subject, message, name });
    res.send(
      "<script>alert('Message sent successfully!'); window.location='/contact';</script>"
    );
  })
);

module.exports = router;