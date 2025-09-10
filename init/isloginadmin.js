module.exports = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.Urlredirect = req.originalUrl;
    console.log(req.session.Urlredirect);
    req.flash('error', "You must login first!");
    return res.redirect('/signin');
  } else {
    next();
  }
};
module.exports.setUrl = (req, res, next) => {
  if (req.session.Urlredirect)
  {
      res.locals.Urlredirect = req.session.Urlredirect;
  }
  next();
}