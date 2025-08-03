export interface TokenPayloadInput {
  userId: string;

  email: string;

  role: string;
}

export interface TokenPayload extends TokenPayloadInput {
  iat: number;

  exp: number;
}
