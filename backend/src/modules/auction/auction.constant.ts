export const ERROR_AUCTION_START_TIME_IN_PAST = (minDate: Date) => ({
  statusCode: 400,
  message: `Start time must be in the future (>= ${minDate.toString()})`,
  errorCode: 'INVALID_AUCTION_START_TIME',
});

export const ERROR_INVALID_AUCTION_TIME = {
  statusCode: 400,
  message: 'Start time must be before end time',
  errorCode: 'INVALID_AUCTION_TIME',
};

export const ERROR_AUCTION_NOT_FOUND = {
  statusCode: 404,
  message: 'Auction not found',
  errorCode: 'AUCTION_NOT_FOUND',
};

export const ERROR_AUCTION_NOT_PENDING = {
  statusCode: 400,
  message: 'Only auctions in PENDING status can be evaluated for opening.',
  errorCode: 'AUCTION_NOT_PENDING',
};

export const ERROR_AUCTION_NOT_CANCELLABLE = {
  statusCode: 400,
  message: 'Only auctions in PENDING status can be canceled.',
  errorCode: 'AUCTION_NOT_CANCELLABLE',
};

export const ERROR_AUCTION_NOT_CLOSABLE = {
  statusCode: 400,
  message: 'Only auctions in OPEN or EXTENDED status can be closed.',
  errorCode: 'AUCTION_NOT_CLOSABLE',
};

export const ERROR_AUCTION_NOT_REOPENED = {
  statusCode: 400,
  errorCode: 'AUCTION_CANT_BE_REOPENED',
  message: 'Auction cannot be reopened',
};

export const ERROR_AUCTION_NOT_SELLER = {
  statusCode: 403,
  message: 'You are not the seller of this auction.',
  errorCode: 'USER_NOT_PERMISSION',
};

export const ERROR_AUCTION_NOT_CLOSED = {
  statusCode: 400,
  message: 'Auction is not closed and cannot be reopened.',
  errorCode: 'AUCTION_NOT_CLOSED',
};

export const ERROR_AUCTION_ALREADY_ENDED = {
  statusCode: 400,
  message: 'Auction has already ended and cannot be reopened.',
  errorCode: 'AUCTION_ALREADY_ENDED',
};

export const ERROR_AUCTION_NOT_OPEN = {
  statusCode: 400,
  message: 'Auction is not open and cannot be extended.',
  errorCode: 'AUCTION_NOT_OPEN',
};

export const ERROR_INVALID_NEW_END_TIME = {
  statusCode: 400,
  message: 'New end time must be after current end time.',
  errorCode: 'INVALID_NEW_END_TIME',
};
