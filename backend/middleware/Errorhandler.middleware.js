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

  // fallback for unexpected errors (e.g. mongoose CastError, programming bugs)
  console.error(err);
  return res.status(500).json({
    success: false,
    statuscode: 500,
    message: "Internal server error",
  });
};

export default errorHandler;