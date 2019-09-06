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

## Test HTTP(s) Endpoint

```
$ TEST_HTTP=true HTTP_ENDPOINTS=api=http://127.0.0.1:8080,other_api=http://127.0.0.1:8081 npm run start
```
