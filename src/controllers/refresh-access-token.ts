import {Request} from 'express';
import {appLogger} from '../loggers';
import AuthenticateManager from '../authentication-code-manager';
import JwtManager from '../utility/json-web-token-manager';
import {
  createFailureHttpResponse,
  createSuccessHttpResponse,
} from '../utility/HttpResponse';
import {createJwtMobileAccessToken} from '../utility/JsonWebToken';
export default async function handleHttpRequest(request: Request) {
  try {
    return await handleHttpRequest_2(request);
  } catch (e) {
    appLogger.error(e);
    appLogger.error(`${request.url} Failed to refresh token`);
    return createFailureHttpResponse(500, 'Internal server error');
  }
}

async function handleHttpRequest_2(request: Request) {
  const manager = AuthenticateManager;
  const refresh_token = request.body.refresh_token;

  /* test if it is a string */
  if (typeof refresh_token !== 'string')
    return createFailureHttpResponse(400, 'Bad Request(no payload)');

  /* test if it exists in the database */
  const trackerId = await manager.getTrackerIdByRefreshToken(refresh_token);
  if (typeof trackerId === 'string') {
    const accessToken = createJwtMobileAccessToken(trackerId);
    const jwt = JwtManager.signMobileAccessToken(trackerId, accessToken);
    return createSuccessHttpResponse(200, 'Ok', {access_token: jwt});
  } else {
    return createFailureHttpResponse(400, 'Bad Request(invalid payload)');
  }
}
