const express = require('express');
const router = express.Router();
const asyncwrap = require('../init/asyncwrap');
const { User } = require('../init/adminuser');
const { setUrl } = require('../init/isloginadmin');
const passport = require('passport');
router.get('/user/signup', (req, res) => {
  res.render('custsignup');
});

router.post('/user/signup', asyncwrap(async (req, res, next) => {
  try {
    const { email, username, password } = req.body;

    // Make sure you are using User schema (not Admin schema!)
    const userreg = new User({ email, username });

    // passport-local-mongoose adds .register()
    const registeredUser = await User.register(userreg, password);

    req.login(registeredUser, (err) => {
      if (err) return next(err);

      req.flash('success', `Welcome ${registeredUser.username}! You are signed up as User.`);
      return res.redirect('/user');  // ✅ make sure this route exists
    });

  } catch (err) {
    console.error("Signup Error:", err.message);
    req.flash('error', "User or email already exists.");
    res.redirect('/user/signup');
  }
}));



router.get(
  `/user/signin`,
  asyncwrap(async (req, res) => {
    res.render('custsignin');
  })
);

router.post(
  '/user/signin',
    setUrl,
    passport.authenticate('user-local', {
    failureRedirect: '/user/signin',
    failureFlash : true
  }),
  asyncwrap(async (req, res) => {
    req.flash('success', 'Wellcome to E-Commerce as user ,' + req.user.username);
    let urlredirect = res.locals.Urlredirect || "/user";
    res.redirect(urlredirect);
  })
);
// logout
router.post('/userlogout', (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    res.redirect('/user');
  });
});
module.exports = router;