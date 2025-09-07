const express = require('express');
const router = express('Router');
const asyncwrap = require('../init/asyncwrap');
const { Admin } = require('../init/adminuser');

router.get(
  '/signup',
  asyncwrap(async (req, res) => {
    res.render('siginup');
  })
);
router.post(
  '/signup',
  asyncwrap(async (req, res) => {
    const { email, password } = req.body;
    const existingUser = await Admin.findOne({ email });
    if (existingUser) {
      return res.send(
        "<script>alert('This email is already taken!'); window.location='/signup'</script>"
      );
    }
    await Admin({ email, password }).save();
    res.send(
      "<script>alert('New user is successfully added!'); window.location='/admin'</script>"
    );
  })
);
module.exports = router;