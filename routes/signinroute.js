const express = require('express');
const router = express.Router();
const asyncwrap = require('../init/asyncwrap');
const { Admin } = require('../init/adminuser');
const passport = require('passport');
router.get(
  '/signin',
  asyncwrap(async (req, res) => {
    res.render('siginin');
  })
);

router.post(
  '/signin', passport.authenticate('local', {
    failureRedirect: '/signin',
    failureFlash : true
  }),
  asyncwrap(async (req, res) => {
    req.flash('success', 'Wellcome to E-Commerce as Admin ,' + req.user.username);
    res.redirect('/admin');
  })
);
// logout
router.post('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    res.redirect('/admin');
  });
});


module.exports = router;