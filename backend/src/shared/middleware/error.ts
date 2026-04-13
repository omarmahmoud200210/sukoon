export class AppError extends Error {
  public isOperational: boolean;

  constructor(
    message: string,
    public statusCode: number,
    isOperational = true,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }

  static NotFound(message = "Resource not found") {
    return new AppError(message, 404);
  }
  static Unauthorized(message = "Unauthorized") {
    return new AppError(message, 401);
  }
  static BadRequest(message = "Bad request") {
    return new AppError(message, 400);
  }
  static Forbidden(message = "Forbidden") {
    return new AppError(message, 403);
  }
  static InternalServerError(message = "Internal server error") {
    return new AppError(message, 500);
  }
}
