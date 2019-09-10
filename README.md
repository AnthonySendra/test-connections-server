# How to run?

```
$ npm i
$ npm run start
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

## Test HTTP(s) Endpoint

```
$ TEST_HTTP=true HTTP_ENDPOINTS=api=http://127.0.0.1:8080,other_api=https://google.com npm run start
```