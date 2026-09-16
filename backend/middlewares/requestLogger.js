// One line per request: method, path, status, duration.
// Deliberately dependency-free; swap for morgan or pino if structured logs are
// ever needed.

const requestLogger = (req, res, next) => {
  const startedAt = process.hrtime.bigint();

  res.on('finish', () => {
    const ms = Number(process.hrtime.bigint() - startedAt) / 1e6;
    console.log(
      `${req.method} ${req.originalUrl} ${res.statusCode} ${ms.toFixed(1)}ms`
    );
  });

  next();
};

module.exports = requestLogger;
