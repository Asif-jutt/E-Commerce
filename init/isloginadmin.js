module.exports = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.Urlredirect = req.originalUrl;
    console.log("Redirect stored:", req.session.Urlredirect);

    // Decide redirect by route
    if (req.originalUrl.startsWith("/admin")) {
      return res.redirect("/admin/signin");
    } else {
      return res.redirect("/user/signin");
    }
  }
  next();
};

module.exports.setUrl = (req, res, next) => {
  if (req.session.Urlredirect)
  {
      res.locals.Urlredirect = req.session.Urlredirect;
  }
  next();
}
module.exports.onlyAdmin=(req, res, next) =>{
  if (req.isAuthenticated() && req.user.kind === "Admin") {
    return next();
  }
  req.flash("error", "You are not authorized to access Admin area");
  res.redirect("/user/signin");
}

module.exports.onlyUser=(req, res, next) =>{
  if (req.isAuthenticated() && req.user.kind === "User") {
    return next();
  }
  req.flash("error", "You are not authorized to access User area");
  res.redirect("/admin/signin");
}
