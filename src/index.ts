import waitOn from 'wait-on';
import express from 'express';
import {appLogger, expressLogger, expressErrorLogger} from './loggers';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import AuthenticationManager from './authentication-code-manager';
import * as Env from './utility/ApplicationParameters';

import handleHttpRequest_1 from './controllers/authentication-code-post';
import handleHttpRequest_2 from './controllers/authentication-code-consume';
import handleHttpRequest_3 from './controllers/refresh-access-token';
import handleHttpRequest_4 from './controllers/check-access-token-valid';
import {isProduction} from './utility/isProduction';

async function startAuthenticationManager() {
  appLogger.info('Await redis server online');
  const {REDIS_HOST, REDIS_PORT} = Env;
  await waitOn({
    resources: [`tcp:${REDIS_HOST}:${REDIS_PORT}`],
    timeout: 30_000,
  });
  appLogger.info('Setup authentication manager');
  AuthenticationManager.start({
    host: REDIS_HOST,
    port: REDIS_PORT,
  });
}

async function setup() {
  await startAuthenticationManager();

  const app = express();

  app.use(bodyParser.json());
  app.use(cookieParser());

  app.use(expressLogger);
  app.post('/trackers/authentication-code', async (request, response) => {
    const httpResponse = await handleHttpRequest_1(request);
    response.status(httpResponse.statusCode).send(httpResponse.response);
  });

  app.post('/trackers/tokens', async (request, response) => {
    const httpResponse = await handleHttpRequest_2(request);
    response.status(httpResponse.statusCode).send(httpResponse.response);
  });

  app.patch('/trackers/tokens', async (request, response) => {
    const httpResponse = await handleHttpRequest_3(request);
    response.status(httpResponse.statusCode).send(httpResponse.response);
  });

  app.put('/trackers/tokens', async (request, response) => {
    const httpResponse = await handleHttpRequest_4(request);
    response.status(httpResponse.statusCode).send(httpResponse.response);
  });

  app.listen(Env.APP_PORT, Env.APP_HOST, () => {
    appLogger.info(`HTTP server running at ${Env.APP_HOST}:${Env.APP_PORT}`);
    if (isProduction) appLogger.info('Running in production mode');
  });

  app.use(expressErrorLogger);
}

setup();
