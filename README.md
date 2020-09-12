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
