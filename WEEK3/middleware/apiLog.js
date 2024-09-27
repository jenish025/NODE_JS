const requestLogger = (req, res, next) => {
  console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
  next(); // Call next() to move to the next middleware or route handler
};
module.exports = requestLogger;
