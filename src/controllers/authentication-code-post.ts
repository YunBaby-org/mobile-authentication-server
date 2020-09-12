import {JwtRestfulCredentials} from '../utility/JsonWebToken';
import Managers from '../utility/json-web-token-manager';
import {Request} from 'express';
import AuthenticationManager from '../authentication-code-manager';
import {
  createFailureResponse,
  createFailureHttpResponse,
  createSuccessHttpResponse,
} from '../utility/HttpResponse';
import {appLogger} from '../loggers';
import {RESTful_JWT} from '../utility/ApplicationParameters';

export interface PostAuthenticationCodeParams {
  token: JwtRestfulCredentials;
  trackerId: string;
}

function hasTrackerPermission(user: string, trackerId: string) {
  return true;
}

function transformJwtToken(token: string) {
  try {
    const JWT = Managers.RestfulAuthenticationServer;
    return JWT.verify(token, {}) as JwtRestfulCredentials;
  } catch (e) {
    return undefined;
  }
}

export default async function handleHttpRequest(request: Request) {
  try {
    return await handleHttpRequest_1(request);
  } catch (e) {
    appLogger.error(e);
    appLogger.error(`${request.url} Faield to handle Request`);
    return {
      statusCode: 500,
      response: createFailureResponse('Internal server error'),
    };
  }
}

async function handleHttpRequest_1(request: Request) {
  /* Extract payload from http request */
  const trackerId = request.body.trackerId;
  const rawJwt = request.cookies[RESTful_JWT];

  /* Test if the Jwt token is provided */
  if (rawJwt === undefined)
    return createFailureHttpResponse(401, 'Unauthorized');

  /* Test if the token is valid */
  const jwt = transformJwtToken(rawJwt);
  if (!jwt) return createFailureHttpResponse(401, 'Invalid JWT token');

  /* Test if the trackerId is provided */
  if (typeof trackerId !== 'string')
    return createFailureHttpResponse(400, 'Invalid payload - trackerId');

  /* Perform the real publishing operation */
  return handleHttpRequest_2({
    trackerId,
    token: jwt,
  });
}

async function handleHttpRequest_2(params: PostAuthenticationCodeParams) {
  /* TODO: Implement the function */
  if (!hasTrackerPermission(params.token.userid, params.trackerId))
    return createFailureHttpResponse(403, 'Permission denied');

  /* TODO: Generate an authentication code for trackerId */
  const result = await AuthenticationManager.putAuthenticationCode(
    params.trackerId
  );

  return createSuccessHttpResponse(200, 'Authentication code granted', {
    authentication_code: result.authentication_code,
    expiry: result.expiry,
    trackerId: params.trackerId,
  });
}
