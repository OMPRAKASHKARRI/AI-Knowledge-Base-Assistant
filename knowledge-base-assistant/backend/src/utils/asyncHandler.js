/**
 * Wraps an async route handler and forwards any thrown/rejected error
 * to Express's error-handling middleware via next(err).
 * This is what lets us write controllers without try/catch everywhere.
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
