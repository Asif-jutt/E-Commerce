// Async wrap middleware
const ExpressError = require('../views/ExpressError');
function asyncwrap(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch((err) =>
      next(new ExpressError(500, 'Something went wrong!'))
    );
  };
}

module.exports = asyncwrap;