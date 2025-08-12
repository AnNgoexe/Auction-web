export const ERROR_CANNOT_FOLLOW_SELF = {
  statusCode: 409,
  errorCode: 'CANNOT_FOLLOW_SELF',
  message: 'You cannot follow yourself',
};

export const ERROR_ALREADY_FOLLOWED = {
  statusCode: 409,
  errorCode: 'ALREADY_FOLLOWED',
  message: 'You have already followed this user',
};

export const ERROR_FOLLOW_BLOCKED = {
  statusCode: 403,
  errorCode: 'FOLLOW_BLOCKED',
  message: 'You cannot follow them',
};

export const ERROR_INVALID_RELATION_ACTION = {
  statusCode: 400,
  errorCode: 'INVALID_RELATION_ACTION',
  message: 'Invalid relationship action',
};

export const ERROR_CANNOT_UNFOLLOW_SELF = {
  statusCode: 409,
  errorCode: 'CANNOT_UNFOLLOW_SELF',
  message: 'User cannot unfollow themselves',
};

export const ERROR_NOT_FOLLOWING = {
  statusCode: 404,
  errorCode: 'NOT_FOLLOWING',
  message: 'You are not following this user',
};

export const ERROR_UNFOLLOW_BLOCKED = {
  statusCode: 403,
  errorCode: 'UNFOLLOW_BLOCKED',
  message: 'You cannot unfollow',
};

export const ERROR_SELLER_NOT_FOUND = {
  statusCode: 404,
  errorCode: 'SELLER_NOT_FOUND',
  message: 'Seller not found or invalid',
};

export const ERROR_BIDDER_NOT_FOUND = {
  statusCode: 404,
  errorCode: 'BIDDER_NOT_FOUND',
  message: 'Bidder not found or invalid',
};

export const ERROR_CANNOT_ACCEPT_SELF = {
  statusCode: 409,
  errorCode: 'CANNOT_ACCEPT_SELF',
  message: 'User cannot accept their own follow request',
};

export const ERROR_CANNOT_DECLINE_SELF = {
  statusCode: 409,
  message: 'You cannot decline yourself',
  errorCode: 'CANNOT_DECLINE_SELF',
};

export const ERROR_NO_FOLLOW_REQUEST = {
  statusCode: 404,
  errorCode: 'NO_FOLLOW_REQUEST',
  message: 'No follow request found',
};

export const ERROR_CANNOT_BLOCK_SELF = {
  statusCode: 409,
  message: 'You cannot block yourself',
  errorCode: 'CANNOT_BLOCK_SELF',
};

export const ERROR_ALREADY_BLOCKED = {
  statusCode: 409,
  message: 'You have already blocked this user',
  errorCode: 'ALREADY_BLOCKED',
};
