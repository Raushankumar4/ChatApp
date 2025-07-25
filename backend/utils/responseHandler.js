const responeHandler = (res, statusCode, success, message, data = null) => {
  return res.status(statusCode).json({
    success,
    message,
    data,
  });
};

export const response = {
  success: (res, message, data = null, statusCode = 200) =>
    responeHandler(res, statusCode, true, message, data),

  error: (res, message, statusCode = 500, data = null) =>
    responeHandler(res, statusCode, false, message, data),
};
