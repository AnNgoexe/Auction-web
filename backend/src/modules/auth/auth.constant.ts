export const ERROR_USER_IS_BANNED = {
  statusCode: 403,
  message: 'User is banned',
  errorCode: 'USER_IS_BANNED',
};

export const ERROR_INVALID_PASSWORD = {
  statusCode: 401,
  errorCode: 'INVALID_PASSWORD',
  message: 'Password is incorrect',
};

export const ERROR_EMAIL_ALREADY_EXISTS = {
  statusCode: 409,
  message: 'Email already exists',
  errorCode: 'EMAIL_ALREADY_EXISTS',
};

export const ERROR_USERNAME_ALREADY_EXISTS = {
  statusCode: 409,
  message: 'Username already exists',
  errorCode: 'USERNAME_ALREADY_EXISTS',
};

export const ERROR_REFRESH_TOKEN_NOT_FOUND = {
  statusCode: 401,
  errorCode: 'REFRESH_TOKEN_NOT_FOUND',
  message: 'Refresh token not found',
};
