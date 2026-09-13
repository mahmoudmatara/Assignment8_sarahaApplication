// Exception
export const ApplicationException = (
  message = "Application Error",
  options = { cause: { status: 400 } }
) => {
  throw new Error(message, options);
};

// 400 Bad Request
export const BadRequestException = (message = "Bad Request") => {
  return ApplicationException(message, { cause: { status: 400 } });
};

// 401 Unauthorized
export const UnauthorizedException = (message = "Unauthorized Access") => {
  return ApplicationException(message, { cause: { status: 401 } });
};

// 403 Forbidden
export const ForbiddenException = (message = "Access Forbidden") => {
  return ApplicationException(message, { cause: { status: 403 } });
};

// 404 Not Found
export const NotFoundException = (message = "Email Not Found") => {
  return ApplicationException(message, { cause: { status: 404 } });
};

// 409 Conflict
export const ConflictException = (message = "Email Already Exists") => {
  return ApplicationException(message, { cause: { status: 409 } });
};

// 422 Unprocessable Entity
export const ValidationException = (message = "Validation Error") => {
  return ApplicationException(message, { cause: { status: 422 } });
};

// 500 Internal Server Error
export const InternalServerErrorException = (
  message = "Internal Server Error"
) => {
  return ApplicationException(message, { cause: { status: 500 } });
};
