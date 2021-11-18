# How to run?

```
$ npm i
$ npm run start
```

## Show more info

```
SHOW_IP_INFO=true npm run start
```

```
SHOW_ENV=true npm run start
```

## Test Redis

```
$ TEST_REDIS=true REDIS_HOST=127.0.0.1 REDIS_PORT=6379 npm run start
```

## Test Elasticsearch

```
$ TEST_ES=true ES_URL=http://127.0.0.1:6379 npm run start
```

## Test Postgres

```
$ TEST_POSTGRES=true POSTGRES_HOST=127.0.0.1 POSTGRES_PORT=5432 POSTGRES_USER=user POSTGRES_DB=db POSTGRES_PASSWORD=mysecretpassword npm run start
```

## Test Mysql

```
$ TEST_MYSQL=true MYSQL_HOST=127.0.0.1 MYSQL_PORT=5432 MYSQL_USER=user MYSQL_DB=db MYSQL_PASSWORD=mysecretpassword npm run start
```

## Test HTTP(s) Endpoint

```
$ TEST_HTTP=true HTTP_ENDPOINTS=api=http://127.0.0.1:8080,other_api=https://google.com npm run start
```

## Test S3

```
$ TEST_S3=true S3_BUCKET_NAME=bucketname S3_REGION=eu-west-1 AWS_ACCESS_KEY_ID=<access_key> AWS_SECRET_ACCESS_KEY=<secret_key> npm run start
```
