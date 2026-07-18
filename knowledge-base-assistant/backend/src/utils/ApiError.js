/**
 * Standardized application error.
 * Lets controllers/services throw a single error type that the global
 * error handler knows how to translate into a consistent HTTP response.
 */
class ApiError extends Error {
  constructor(statusCode, message, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true; // distinguishes expected errors from programming bugs
    Error.captureStackTrace(this, this.constructor);
  }
}

export default ApiError;
