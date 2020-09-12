import path from 'path';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

/* Load environment from file */
dotenv.config({
  path: process.env.DOTENV_PATH || path.resolve(process.cwd(), '.env'),
  debug: process.env.NODE_ENV === 'production' ? false : true,
});

export const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
export const REDIS_PORT = parseInt(process.env.REDIS_PORT || '6379');

export const RESTful_JWT = process.env.RESTFUL_JWT || 'JWT_TOKEN';

export const POSTGRES_HOST = process.env.POSTGRES_HOST || 'localhost';
export const POSTGRES_PORT = parseInt(process.env.POSTGRES_PORT || '5432');
export const POSTGRES_DATABASE = process.env.POSTGRES_DATABASE || 'postgres';
export const POSTGRES_USERNAME = process.env.POSTGRES_USERNAME || 'postgres';
export const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD || 'password';

export const RESTFUL_SECRET_FILE = process.env.RESTFUL_SECRET_FILE;
export const RESTFUL_SECRET = process.env.RESTFUL_SECRET || 'JwtSecretKey';
export const MOBILE_SECRET_FILE = process.env.MOBILE_SECRET_FILE;
export const MOBILE_SECRET = process.env.MOBILE_SECRET || 'BabyShark';

export const APP_HOST = process.env.APP_HOST || '0.0.0.0';
export const APP_PORT = parseInt(process.env.APP_PORT || '3000');

export const MOBILE_JWT_ISSUER_NAME =
  process.env.MOBILE_JWT_ISSUER_NAME || 'Mobile-Auth';
export const MOBILE_JWT_ALGORITHM = (process.env.MOBILE_JWT_ALGORITHM ||
  'HS256') as jwt.Algorithm;

switch (MOBILE_JWT_ALGORITHM) {
  case 'HS256':
  case 'HS384':
  case 'HS512':
  case 'RS256':
  case 'RS384':
  case 'RS512':
  case 'ES256':
  case 'ES384':
  case 'ES512':
  case 'PS256':
  case 'PS384':
  case 'PS512':
    break;
  case 'none':
    throw new Error('Insecure algorithm - none');
  default:
    throw new Error(`Invalid JWT Algorithm - ${MOBILE_JWT_ALGORITHM}`);
}
