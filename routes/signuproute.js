const express = require('express');
const router = express('Router');
const asyncwrap = require('../init/asyncwrap');
const { Admin } = require('../init/adminuser');

router.get(
  '/admin/signup',
  asyncwrap(async (req, res) => {
    res.render('siginup');
  })
);
router.post(
  '/admin/signup',
  asyncwrap(async (req, res, next) => {
    try {
      const { email, username, password } = req.body;
      const adminreg = new Admin({ email, username });
      let admin = await Admin.register(adminreg, password);

      await new Promise((resolve, reject) => {
        req.login(admin, (err) => {
          if (err) return reject(err);
          resolve();
        });
      });

      req.flash('success', 'Admin registered Successfully, Welcome to Admin Interface');
      res.redirect('/admin');

    } catch (err) {
      req.flash('error', "Email or Username already exists.");
      res.redirect('/admin/signup');  // fixed path
    }
  })
);




module.exports = router;