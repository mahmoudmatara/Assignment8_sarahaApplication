const errorMiddleware = (err, req, res, next) => {
  console.error(err);
  return res.status(err.cause?.status || 500).json({
    success: false,
    message: err.message || "Something went wrong",
  });
};

export default errorMiddleware;
