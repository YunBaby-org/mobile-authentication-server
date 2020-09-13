# Mobile Authentication Server

The authentication for mobile device

## Use case

1. Distribute authentication code for frontend application.
2. Exchange authentication code with the access token & refresh token of tracker device.
3. Refresh the access token with specific refresh token.

## Environments

Place environment variable in file '.env' or specify the location of that file with environment variable `DOTENV_PATH`. the latter is suitable for docker swarm setup

### Redis token storage

- `REDIS_HOST`: the host of redis server
- `REDIS_PORT`: the port of redis server

### Postgres

- `POSTGRES_HOST`: the host of postgres
- `POSTGRES_PORT`: the port of postgres
- `POSTGRES_DATABASE`: the database of postgres
- `POSTGRES_USRENAME`: the username of postgres
- `POSTGRES_PASSWORD`: the password of postgres

### JWT

- `RESTful_JWT`: the secret token of RESTful server
- `RESTFUL_SECRET`: the secret of RESTful server JWT
- `RESTFUL_SECRET_FILE`: the secret file of RESTful JWT (suitable for docker swarm setup)
- `MOBILE_SECRET`: the secret of mobile JWT
- `MOBILE_SECRET_FILE`: the secret file of mobile JWT (suitable for docker swarm setup)

### Authentication server

- `APP_HOST`: the listening address of this mobile authentication server
- `APP_PORT`: the listening port of this mobile authentication server

### Mobile JWT related configuration

- `MOBILE_JWT_ISSUER_NAME`: the issuer (iss) field of mobile JWT
- `MOBILE_JWT_ALGORITHM`: the algorithm for mobile JWT signing operation

## Mobile JWT example

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0cmFja2VySWQiOiJnYXJ5cGFycm90IiwicGVybWlzc2lvbiI6eyJ2aG9zdCI6WyJ0cmFja2VyIl19LCJpYXQiOjE1OTk5Mzk3NjAsImV4cCI6MTU5OTkzOTg4MCwiYXVkIjoidHJhY2tlciIsImlzcyI6Ik1vYmlsZS1BdXRoIiwic3ViIjoiZ2FyeXBhcnJvdCIsImp0aSI6IjVjMjFjZDA5MTkwZTBmNTMifQ.yAJESOmHJLJpez1bF_PJysgY9C0xHZxlqV18ulzAsAQ
```

```
{
  "trackerId": "garyparrot",
  "permission": {
    "vhost": [
      "tracker"
    ]
  },
  "iat": 1599939760,
  "exp": 1599939880,
  "aud": "tracker",
  "iss": "Mobile-Auth",
  "sub": "garyparrot",
  "jti": "5c21cd09190e0f53"
}
```

- The issuer is specified by an environment variable, you should not expect it to be "Mobile-Auth"
- The algorithm is specified by an environment variable, you should not expect it to be "HS256"

## Roadmap

1. Exchange the algorithm to RS256.
