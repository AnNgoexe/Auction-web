export const ERROR_INTERNAL_SERVER = {
  statusCode: 500,
  message: 'An unexpected error occurred',
  errorCode: 'INTERNAL_SERVER_ERROR',
};

export const ERROR_CLASS_VALIDATION_FAILED = {
  statusCode: 400,
  message: 'Class validation failed',
  errorCode: 'ERROR_CLASS_VALIDATION_FAILED',
};

export const ERROR_ACCESS_TOKEN_EXPIRED = {
  statusCode: 400,
  errorCode: 'ACCESS_TOKEN_EXPIRED',
  message: 'Access token has expired',
};

export const ERROR_INVALID_ACCESS_TOKEN = {
  statusCode: 400,
  errorCode: 'INVALID_ACCESS_TOKEN',
  message: 'Access token is invalid',
};

export const ERROR_UNKNOWN_ACCESS_TOKEN = {
  statusCode: 400,
  errorCode: 'UNKNOWN_ACCESS_TOKEN',
  message: 'Unknown error occurred while verifying access token',
};

export const ERROR_REFRESH_TOKEN_EXPIRED = {
  statusCode: 400,
  errorCode: 'REFRESH_TOKEN_EXPIRED',
  message: 'Refresh token has expired',
};

export const ERROR_INVALID_REFRESH_TOKEN = {
  statusCode: 400,
  errorCode: 'INVALID_REFRESH_TOKEN',
  message: 'Refresh token is invalid',
};

export const ERROR_UNKNOWN_REFRESH_TOKEN = {
  statusCode: 400,
  errorCode: 'UNKNOWN_REFRESH_TOKEN',
  message: 'Unknown error occurred while verifying refresh token',
};
