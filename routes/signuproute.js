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
  asyncwrap(async (req, res, next) => {
    try {
      const { email, username, password } = req.body;
      const adminreg = new Admin({ email, username });
      let user = await Admin.register(adminreg, password);
      console.log(user);
      req.flash('success', 'Admin registered Successfully');
      
      req.login(user, err => {
        if (err) return next(err);
        res.redirect('/admin');
      });

    } catch (err) {
      req.flash('error', "User or email already exist.");
      res.redirect('/signup');
    }
  })
);

module.exports = router;