export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  console.error("Error:", err.message);
  console.error("Stack Trace:", err.stack);
  res.status(statusCode).json({
    success: false,
    message: err.message,
    stack: err.stack,
  });
};
