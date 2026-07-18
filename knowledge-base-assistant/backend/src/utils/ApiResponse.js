/**
 * Standardized success response shape so the frontend can rely on a
 * single response contract: { success, message, data }.
 */
class ApiResponse {
  constructor(statusCode, message, data = null) {
    this.success = statusCode < 400;
    this.message = message;
    this.data = data;
  }
}

export default ApiResponse;
