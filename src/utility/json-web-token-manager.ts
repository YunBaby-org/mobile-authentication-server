import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import fs from 'fs';
import {
  isJwtRestfulCredentials,
  isJwtMobileAccessToken,
  JwtMobileAccessToken,
} from './JsonWebToken';
import * as Environments from '../utility/ApplicationParameters';

type JwtStringTypeChecker = (target: string) => boolean;
type JwtObjectTypeChecker = (target: object) => boolean;
type JwtTypeChecker = JwtStringTypeChecker | JwtObjectTypeChecker;

export class JsonWebTokenManager {
  private defaultSigningOption: jwt.SignOptions | undefined;
  private defaultVerifingOption: jwt.VerifyOptions | undefined;
  private secret: string;
  private typeChecker: JwtTypeChecker | undefined;

  constructor(
    secret: string,
    checker?: JwtTypeChecker,
    defaultSigningOption?: jwt.SignOptions,
    defaultVerifingOption?: jwt.VerifyOptions
  ) {
    this.defaultSigningOption = defaultSigningOption;
    this.defaultVerifingOption = defaultVerifingOption;
    this.secret = secret;
    this.typeChecker = checker;
  }

  sign(payload: object, options: jwt.SignOptions) {
    /* Ensure the content of payload fit the constraints */
    if (this.typeChecker && !this.runChecker(payload, 'object'))
      throw new InvalidJwtFormatError();

    const opt = {...this.defaultSigningOption, ...options};
    return jwt.sign(payload, this.secret, opt);
  }

  verify(token: string, options: jwt.VerifyOptions) {
    const opt = {...this.defaultVerifingOption, ...options};
    const content = jwt.verify(token, this.secret, opt);
    /* Ensure the content of payload fit the constraints */
    const type = typeof content === 'string' ? 'string' : 'object';
    if (this.typeChecker && !this.runChecker(content, type))
      throw new InvalidJwtFormatError();

    return content;
  }

  private runChecker(target: string | object, type: 'string' | 'object') {
    /* For some complicated reason we cannot call typeChecker directly */
    switch (type) {
      case 'string':
        return (this.typeChecker as JwtStringTypeChecker)(target as string);
      case 'object':
        return (this.typeChecker as JwtObjectTypeChecker)(target as object);
      default:
        throw Error('This should never triggered');
    }
  }
}

class Managers {
  public readonly RestfulAuthenticationServer: JsonWebTokenManager;
  public readonly MobileAuthenticationServer: JsonWebTokenManager;
  constructor() {
    /* RESTful authentication server */
    const restSecret = this.getRESTfulSecret();
    const restChecker = isJwtRestfulCredentials;
    this.RestfulAuthenticationServer = new JsonWebTokenManager(
      restSecret,
      restChecker,
      {}
    );

    /* Mobile authentication server */
    const mobileSecret = this.getMobileSecret();
    const mobileChecker = isJwtMobileAccessToken;
    this.MobileAuthenticationServer = new JsonWebTokenManager(
      mobileSecret,
      mobileChecker,
      {
        issuer: Environments.MOBILE_JWT_ISSUER_NAME,
        algorithm: Environments.MOBILE_JWT_ALGORITHM,
        audience: 'tracker',
      },
      {
        issuer: Environments.MOBILE_JWT_ISSUER_NAME,
        algorithms: [Environments.MOBILE_JWT_ALGORITHM],
        audience: 'tracker',
        clockTolerance: 5,
      }
    );
  }

  signMobileAccessToken(trackerId: string, accessToken: JwtMobileAccessToken) {
    return this.MobileAuthenticationServer.sign(accessToken, {
      expiresIn: 2 * 60,
      subject: trackerId,
      jwtid: crypto.randomBytes(8).toString('hex'),
    });
  }

  private getRESTfulSecret() {
    if (Environments.RESTFUL_SECRET_FILE)
      return fs.readFileSync(Environments.RESTFUL_SECRET_FILE).toString('utf8');
    if (Environments.RESTFUL_SECRET) return Environments.RESTFUL_SECRET;
    throw new Error('RESTful server secret is not specified');
  }

  private getMobileSecret() {
    if (Environments.MOBILE_SECRET_FILE)
      return fs.readFileSync(Environments.MOBILE_SECRET_FILE).toString('utf8');
    if (Environments.MOBILE_SECRET) return Environments.MOBILE_SECRET;
    throw new Error('Mobile server secret is not specified');
  }
}

export class InvalidJwtFormatError {
  message = 'The format of specific Jwt Payload is invalid';
}

/* Pre-defined token managers */
export default new Managers();
