const express = require('express');
const router = express.Router();
const asyncwrap = require('../init/asyncwrap');
const { Admin } = require('../init/adminuser');
const passport = require('passport');
const {setUrl} = require('../init/isloginadmin');
router.get(
  '/signin',
  asyncwrap(async (req, res) => {
    res.render('siginin');
  })
);

router.post(
  '/signin',
    setUrl,
     passport.authenticate('local', {
    failureRedirect: '/signin',
    failureFlash : true
  }),
  asyncwrap(async (req, res) => {
    req.flash('success', 'Wellcome to E-Commerce as Admin ,' + req.user.username);
    let urlredirect = res.locals.Urlredirect || "/admin";
    res.redirect(urlredirect);
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