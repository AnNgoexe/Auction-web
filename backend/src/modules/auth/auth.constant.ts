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

export const ERROR_EMAIL_NOT_FOUND = {
  statusCode: 404,
  message: 'Email not found',
  errorCode: 'EMAIL_NOT_FOUND',
};

export const ERROR_PASSWORD_CONFIRM_MISMATCH = {
  statusCode: 400,
  errorCode: 'PASSWORD_CONFIRM_MISMATCH',
  message: 'New password and confirm password do not match',
};

export const ERROR_INVALID_LOGOUT_TOKEN = {
  statusCode: 401,
  errorCode: 'INVALID_LOGOUT_TOKEN',
  message: 'Invalid token for logout or token does not belong to the user',
};
