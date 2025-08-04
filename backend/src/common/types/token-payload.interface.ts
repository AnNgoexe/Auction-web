export interface AccessTokenPayloadInput {
  userId: string;

  email: string;

  role: string;

  username: string;

  provider: string;

  isVerified: boolean;

  isBanned: boolean;
}

export interface AccessTokenPayload extends AccessTokenPayloadInput {
  iat: number;

  exp: number;
}

export interface RefreshTokenPayloadInput {
  userId: string;

  tokenId: string;

  provider: string;
}

export interface RefreshTokenPayload extends RefreshTokenPayloadInput {
  iat: number;

  exp: number;
}
