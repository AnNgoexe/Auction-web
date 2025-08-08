export const ERROR_OTP_NOT_FOUND = {
  statusCode: 404,
  errorCode: 'OTP_NOT_FOUND',
  message: 'OTP code not found or expired',
};

export const ERROR_OTP_EXPIRED = {
  statusCode: 410,
  errorCode: 'OTP_EXPIRED',
  message: 'OTP code has expired',
};

export const ERROR_OTP_INVALID = {
  statusCode: 400,
  errorCode: 'OTP_INVALID',
  message: 'OTP code is invalid',
};
