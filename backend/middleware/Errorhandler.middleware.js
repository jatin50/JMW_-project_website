import { apierrors } from "../src/utils/apierrors.js";
import multer from "multer";

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

  if (err instanceof multer.MulterError || err.message?.includes("Only JPEG")) {
    return res.status(400).json({
      success: false,
      statuscode: 400,
      message: err.message,
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