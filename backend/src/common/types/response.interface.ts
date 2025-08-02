export interface ResponsePayload<T = unknown> {
  message: string;
  data: T;
}

export interface Response<T extends ResponsePayload> {
  statusCode: number;

  data?: T['data'] | object;

  message: T['message'] | string;

  errorCode?: string;
}
