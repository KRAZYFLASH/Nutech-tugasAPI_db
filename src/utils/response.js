// Success response utility
export const successResponse = (res, statusCode, message, data = null) => {
  const response = {
    status: statusCode,
    message: message,
    data: null,
  };

  if (data !== null) {
    response.data = data;
  }

  return res.status(200).json(response);
};

// Error response utility
export const errorResponse = (res, statusCode, status, message) => {
  return res.status(statusCode).json({
    status: status,
    message: message,
    data: null,
  });
};
