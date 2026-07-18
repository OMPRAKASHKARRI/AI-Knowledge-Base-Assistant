import ApiError from '../utils/ApiError.js';

/**
 * Converts any thrown error (ApiError, Mongoose error, Multer error,
 * JSON parse error, or unexpected bug) into a consistent JSON response.
 * This must be registered LAST in server.js, after all routes.
 */
const errorHandler = (err, req, res, next) => {
  let error = err;

  // Normalize known non-ApiError cases into ApiError so the response shape stays consistent
  if (!(error instanceof ApiError)) {
    let statusCode = error.statusCode || 500;
    let message = error.message || 'Something went wrong';

    // Mongoose validation error
    if (error.name === 'ValidationError') {
      statusCode = 400;
      message = Object.values(error.errors)
        .map((e) => e.message)
        .join(', ');
    }

    // Mongoose duplicate key error (e.g. email already registered)
    if (error.code === 11000) {
      statusCode = 409;
      const field = Object.keys(error.keyValue || {})[0];
      message = `${field ? field.charAt(0).toUpperCase() + field.slice(1) : 'Field'} already in use`;
    }

    // Mongoose invalid ObjectId
    if (error.name === 'CastError') {
      statusCode = 400;
      message = `Invalid ${error.path}: ${error.value}`;
    }

    // Multer file upload errors
    if (error.name === 'MulterError') {
      statusCode = 400;
      message = error.message;
    }

    error = new ApiError(statusCode, message);
  }

  if (process.env.NODE_ENV !== 'production') {
    console.error(`[ERROR] ${req.method} ${req.originalUrl} -> ${error.statusCode}: ${error.message}`);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Internal server error',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};

// Catches requests to routes that don't exist
export const notFound = (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

export default errorHandler;
