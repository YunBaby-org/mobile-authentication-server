export interface JwtRestfulCredentials {
  userid: string;
}

export function isJwtRestfulCredentials(obj: object) {
  const asObject = (obj as unknown) as JwtRestfulCredentials;
  return typeof asObject.userid === 'string';
}

type RabbitPermission = {name: string; rwc: [boolean, boolean, boolean]};

export interface JwtMobileAccessToken {
  trackerId: string;
  permission: {
    vhost: [string];
    exchange?: [RabbitPermission];
    queue?: [RabbitPermission];
    topic?: [RabbitPermission];
  };
}

export function createJwtMobileAccessToken(
  trackerId: string
): JwtMobileAccessToken {
  return {
    trackerId: trackerId,
    permission: {vhost: ['tracker/moble']},
  };
}

export function RabbitPermission(
  name: string,
  read: boolean,
  write: boolean,
  configure: boolean
): RabbitPermission {
  return {
    name: name,
    rwc: [read, write, configure],
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
