export interface JwtRestfulCredentials {
  userid: string;
}

export function isJwtRestfulCredentials(obj: object) {
  const asObject = (obj as unknown) as JwtRestfulCredentials;
  return typeof asObject.userid === 'string';
}

export interface JwtMobileAccessToken {
  trackerId: string;
  permission: {
    vhost: [string];
  };
}

export function createJwtMobileAccessToken(
  trackerId: string
): JwtMobileAccessToken {
  return {
    trackerId: trackerId,
    permission: {vhost: ['tracker']},
  };
}

export function isJwtMobileAccessToken(obj: object) {
  const asObject = (obj as unknown) as JwtMobileAccessToken;
  if (typeof asObject.trackerId !== 'string') return false;
  if (typeof asObject.permission !== 'object') return false;
  /* TODO: Improve this if you want */
  return true;
}

export interface JwtMobileRefreshToken {
  trackerId: string;
}
