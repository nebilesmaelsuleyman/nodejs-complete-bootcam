// catchAsync is a higher-order function that takes another
//  function (fn) as a parameter.

module.exports = (fn) => {
  return (req, res, next) => {
    if (typeof fn !== 'function') {
      const error = new Error('Middleware argument must be a function');
      return next(error);
    }

    fn(req, res, next).catch(next);
  };
};