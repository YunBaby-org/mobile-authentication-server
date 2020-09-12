import {Request} from 'express';
import Managers from '../utility/json-web-token-manager';
import AuthenticateManager, {
  DeleteAuthenticationCodeFailedError,
} from '../authentication-code-manager';
import {
  createFailureHttpResponse,
  createSuccessHttpResponse,
} from '../utility/HttpResponse';
import {appLogger} from '../loggers';
import {createJwtMobileAccessToken} from '../utility/JsonWebToken';

export default async function handleHttpRequest(request: Request) {
  try {
    return await handleHttpRequest_2(request);
  } catch (e) {
    appLogger.error(e);
    appLogger.error(`${request.url} internal server error`);
    return createFailureHttpResponse(500, 'Internal server error');
  }
}

async function handleHttpRequest_2(request: Request) {
  appLogger.debug('Requesting access token by authentication code');
  const authentication_code = request.body.authentication_code;

  /* Test if the authentication code is provided */
  if (authentication_code === undefined)
    return createFailureHttpResponse(400, 'No authentication code');

  /* Grant the authentication code */
  const target = await AuthenticateManager.getAuthenticationCode(
    authentication_code
  );

  /* Test if Authentication code not found */
  if (target === undefined)
    return createFailureHttpResponse(400, 'Bad Request');

  const {trackerId, expiry} = target;

  /* Consume the code */
  try {
    AuthenticateManager.deleteAuthenticationCode(authentication_code);
  } catch (e) {
    if (e instanceof DeleteAuthenticationCodeFailedError) {
      const message = `Failed to remove authentication code: ${authentication_code}`;
      appLogger.error(message);
    } else {
      throw e;
    }
  }

  /* Test if the code already timeout, 60 second for clock skew. */
  if (Math.floor(Date.now() / 1000) > expiry + 60)
    return createFailureHttpResponse(400, 'Authenticatoin code timeouted');

  /* Signing a access token */
  const accessToken = createJwtMobileAccessToken(target.trackerId);
  const jwtAccessToken = Managers.signMobileAccessToken(trackerId, accessToken);

  /* Generate a refresh token */
  const refreshToken = await AuthenticateManager.spawnRefreshToken(
    target.trackerId
  );

  return createSuccessHttpResponse(200, 'Ok', {
    access_token: jwtAccessToken,
    refresh_token: refreshToken,
  });
}
