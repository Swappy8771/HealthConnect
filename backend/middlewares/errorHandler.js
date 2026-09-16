// Central 404 and error handling.
//
// Express 5 forwards a rejected async handler to the error middleware, so this
// catches what a route's own try/catch misses. It also stops internal details
// leaking: err.message (including raw Mongo errors) is returned only outside
// production.

const notFound = (req, res) => {
  res.status(404).json({ message: 'Route not found' });
};

// Express identifies an error handler by its four parameters — `next` must stay
// even though it is unused.
const errorHandler = (err, req, res, next) => {
  const status = err.status || err.statusCode || 500;

  if (status >= 500) {
    console.error(`[error] ${req.method} ${req.originalUrl}:`, err.stack || err.message);
  }

  const body = { message: status >= 500 ? 'Server error' : err.message };

  if (process.env.NODE_ENV !== 'production' && status >= 500) {
    body.error = err.message;
  }

  res.status(status).json(body);
};

module.exports = { notFound, errorHandler };
