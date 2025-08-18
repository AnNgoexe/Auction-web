export const ERROR_PRODUCT_NOT_FOUND = {
  statusCode: 404,
  errorCode: 'PRODUCT_NOT_FOUND',
  message: 'Product not found',
};

export const ERROR_NO_PRODUCTS_PROVIDED = {
  statusCode: 400,
  errorCode: 'NO_PRODUCTS_PROVIDED',
  message: 'No products provided',
};

export const ERROR_CATEGORIES_NOT_FOUND = {
  statusCode: 400,
  errorCode: 'CATEGORIES_NOT_FOUND',
  message: 'One or more categories do not exist',
};

export const ERROR_CANNOT_UPDATE_SOLD_PRODUCT = {
  statusCode: 400,
  errorCode: 'CANNOT_UPDATE_SOLD_PRODUCT',
  message: 'Cannot update a sold product',
};

export const ERROR_CANNOT_SET_STATUS_SOLD = {
  statusCode: 400,
  errorCode: 'CANNOT_SET_STATUS_SOLD',
  message: 'Cannot manually set status to SOLD',
};
