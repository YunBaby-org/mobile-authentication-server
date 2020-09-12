import redis from 'redis';
import crypto from 'crypto';
import {promisify} from 'util';
import {appLogger} from './loggers';

export class AuthenticationCodeManager {
  private redisClient: redis.RedisClient | undefined;

  constructor() {
    this.redisClient = undefined;
  }

  async start(options?: redis.ClientOpts | undefined) {
    this.redisClient = redis.createClient(options);
    this.redisClient.on('end', error => {
      appLogger.error(error);
    });
  }

  async putAuthenticationCode(trackerId: string) {
    const token = await this.createSecurityToken();
    const key = this.keyOfAuthenticationCode(token);
    const expiry = Math.floor(Date.now() / 1000) + 60 * 3;
    /* Consider perform error checking */
    this.redisClient!.hmset(key, 'trackerId', trackerId, 'expiry', expiry);

    return {
      authentication_code: token,
      expiry,
    };
  }

  async getAuthenticationCode(authentication_code: string) {
    const key = this.keyOfAuthenticationCode(authentication_code);
    const result = await promisify<{[key: string]: string}>(callback =>
      this.redisClient!.hgetall(key, callback)
    )();

    if (!result || !result.trackerId || !result.expiry) return undefined;

    return {
      trackerId: result.trackerId,
      expiry: parseInt(result.expiry),
    };
  }

  async deleteAuthenticationCode(authentication_code: string) {
    /* TODO: Implement this */
  }

  async spawnRefreshToken(trackerId: string) {
    /* TODO: Remove old refresh token if the tracker already have one */
    const token = await this.createSecurityToken();
    const keyRefreshToken = this.keyOfRefreshToken(token);
    const keyTrackerId = this.keyOfTrackerRefreshToken(trackerId);
    this.redisClient!.set(keyRefreshToken, trackerId);
    this.redisClient!.set(keyTrackerId, token);

    return token;
  }

  async getTrackerIdByRefreshToken(token: string) {
    const key = this.keyOfRefreshToken(token);
    const trackerId = await promisify<string | null>(callback =>
      this.redisClient!.get(key, callback)
    )();

    return trackerId;
  }

  keyOfRefreshToken(token: string) {
    return `/refresh_token/${token}`;
  }

  keyOfTrackerRefreshToken(trackerId: string) {
    return `/trackerId_refresh_token/${trackerId}`;
  }

  keyOfAuthenticationCode(token: string) {
    return `/authentication_code/${token}`;
  }

  private async createSecurityToken() {
    return promisify<Buffer>(callback =>
      crypto.randomBytes(32, callback)
    )().then(buffer => buffer.toString('hex'));
  }
}

export default new AuthenticationCodeManager();
