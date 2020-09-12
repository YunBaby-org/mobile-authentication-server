export function createFailureResponse(reason: string, payload?: object) {
  return {
    status: 'Failure',
    reason: reason,
    ...(payload ? {payload: payload} : {}),
  };
}

export function createSuccessResponse(info: string, payload?: object) {
  return {
    status: 'Success',
    info: info,
    ...(payload ? {payload: payload} : {}),
  };
}

export function createFailureHttpResponse(
  statusCode: number,
  reason: string,
  payload?: object
) {
  return {
    statusCode,
    response: createFailureResponse(reason, payload),
  };
}

export function createSuccessHttpResponse(
  statusCode: number,
  info: string,
  payload?: object
) {
  return {
    statusCode,
    response: createSuccessResponse(info, payload),
  };
}

export interface HttpResponse {
  statusCode: number;
  response?: object | undefined;
}
