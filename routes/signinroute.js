const express = require('express');
const router = express('Router');
const asyncwrap = require('../init/asyncwrap');
const { Admin } = require('../init/adminuser');

router.get(
  '/signin',
  asyncwrap(async (req, res) => {
    res.render('siginin');
  })
);

router.post(
  '/signin',
  asyncwrap(async (req, res) => {
    const user = await Admin.findOne({
      email: req.body.email,
      password: req.body.password,
    });
    if (!user)
      return res.send(
        "<script>alert('Invalid email or password!'); window.location='/signin';</script>"
      );
    res.redirect('/admin');
  })
);

module.exports = router;