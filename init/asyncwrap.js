// Async wrap middleware
function asyncwrap(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch(next); // Pass original error to Express
  };
}

module.exports = asyncwrap;
