export const ERROR_USER_BLOCKED = {
  statusCode: 403,
  message: 'User is blocked',
  errorCode: 'USER_IS_BLOCKED',
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

export const ERROR_EMAIL_ALREADY_VERIFIED = {
  statusCode: 400,
  message: 'Email already verified',
  errorCode: 'EMAIL_ALREADY_VERIFIED',
};

export const ERROR_REFRESH_TOKEN_NOT_FOUND = {
  statusCode: 401,
  errorCode: 'REFRESH_TOKEN_NOT_FOUND',
  message: 'Refresh token not found',
};

export const ERROR_USER_NOT_FOUND = {
  statusCode: 404,
  message: 'User not found',
  errorCode: 'USER_NOT_FOUND',
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
