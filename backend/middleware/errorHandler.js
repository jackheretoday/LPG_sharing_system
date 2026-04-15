const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  const isDevelopment = process.env.NODE_ENV === "development";

  res.status(statusCode).json({
    success: false,
    message: err.message,
    stack: isDevelopment ? err.stack : undefined,
  });
};

module.exports = errorHandler;
