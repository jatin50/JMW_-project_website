import { apierrors } from "../src/utils/apierrors.js";

// centralized error handler - must be registered last, after all routes
const errorHandler = (err, req, res, next) => {
  if (err instanceof apierrors) {
    return res.status(err.statuscode).json({
      success: false,
      statuscode: err.statuscode,
      message: err.message,
      errors: err.errors,
    });
  }

  // fallback for unexpected errors (e.g. mongoose CastError, malformed JSON body, programming bugs)
  console.error(err);
  const statuscode = err.statusCode || err.status || 500;
  return res.status(statuscode).json({
    success: false,
    statuscode,
    message: statuscode === 500 ? "Internal server error" : err.message,
  });
};

export default errorHandler;