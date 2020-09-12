import {Request} from 'express';
import * as Jwt from 'jsonwebtoken';
import Managers, {
  InvalidJwtFormatError,
} from '../utility/json-web-token-manager';
import {appLogger} from '../loggers';
import {
  createFailureHttpResponse,
  createSuccessHttpResponse,
} from '../utility/HttpResponse';

export default async function handleHttpRequest(request: Request) {
  try {
    return await handleHttpRequest_1(request);
  } catch (e) {
    appLogger.error(e);
    appLogger.error(`${request.url} Internal server error`);
    return createFailureHttpResponse(500, 'Internal server error');
  }
}

async function handleHttpRequest_1(request: Request) {
  const access_token = request.body.access_token;

  if (typeof access_token !== 'string')
    return createFailureHttpResponse(400, 'Bad Request(No payload)');

  const jwtManager = Managers.MobileAuthenticationServer;

  try {
    jwtManager.verify(access_token, {});
    return createSuccessHttpResponse(200, 'Ok', {valid: true});
  } catch (e) {
    if (e instanceof Jwt.TokenExpiredError || e instanceof Jwt.NotBeforeError)
      return createFailureHttpResponse(400, 'Bad Request(Token expired)', {
        valid: false,
      });
    else if (e instanceof Jwt.JsonWebTokenError)
      return createFailureHttpResponse(400, 'Bad Request(Invalid JWT)', {
        valid: false,
      });
    else if (e instanceof InvalidJwtFormatError)
      return createFailureHttpResponse(400, 'Bad Request(Not Access Token)', {
        valid: false,
      });
    else throw e;
  }
}
