module.exports = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash('error', "You must login first!");
    return res.redirect('/signin');
  } else {
    next();
  }
};
