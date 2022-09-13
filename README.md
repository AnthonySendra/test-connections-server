- [How to run?](#how-to-run-)
- [Show more info](#show-more-info)
- [Custom Name](#custom-name)
- [Test Redis](#test-redis)
- [Test Elasticsearch](#test-elasticsearch)
- [Test Postgres](#test-postgres)
- [Test Mysql](#test-mysql)
- [Test HTTP(s) Endpoint](#test-http-s--endpoint)
- [Test S3](#test-s3)
- [Wait before starting the server](#wait-before-starting-the-server)
- [Simulate workload (with Fibonacci)](#simulate-workload--with-fibonacci-)
- [ls-directory](#ls-directory)
- [touch](#touch-file)
- [Use Docker](#use-docker)

# How to run?

```
$ npm i
$ npm run start
```

# Show more info

```
SHOW_IP_INFO=true npm run start
```

```
SHOW_ENV=true npm run start
```

# Custom Name

```
NAME=toto npm run start
```

# Test Redis

```
$ TEST_REDIS=true REDIS_HOST=127.0.0.1 REDIS_PORT=6379 npm run start
```

# Test Elasticsearch

```
$ TEST_ES=true ES_URL=http://127.0.0.1:6379 npm run start
```

# Test Postgres

```
$ TEST_POSTGRES=true POSTGRES_HOST=127.0.0.1 POSTGRES_PORT=5432 POSTGRES_USER=user POSTGRES_DB=db POSTGRES_PASSWORD=mysecretpassword npm run start
```

# Test Mysql

```
$ TEST_MYSQL=true MYSQL_HOST=127.0.0.1 MYSQL_PORT=5432 MYSQL_USER=user MYSQL_DB=db MYSQL_PASSWORD=mysecretpassword npm run start
```

# Test HTTP(s) Endpoint

```
$ TEST_HTTP=true HTTP_ENDPOINTS=api=http://127.0.0.1:8080,other_api=https://google.com npm run start
```

# Test S3

```
$ TEST_S3=true S3_BUCKET_NAME=bucketname S3_REGION=eu-west-1 AWS_ACCESS_KEY_ID=<access_key> AWS_SECRET_ACCESS_KEY=<secret_key> npm run start
```

# Wait before starting the server

Wait 5000ms:
```
WAIT=5000 npm run start
```

# Simulate workload (with Fibonacci)

Once the server is started, call the server with `fibonacci` query URL:

```
PORT=8087 npm run start
curl http://localhost:8087?fibonacci=30
```

# LS directory

```
LS_DIR=/my/path npm run start
```

# Touch file

```
PORT=8087 TOUCH=/my/file.txt npm run start
curl http://localhost:8087 # ignore touch and return last access time of file /my/file.txt
curl http://localhost:8087?touch=1 # create and set access time of file /my/file.txt to now
curl http://localhost:8087?touch=2022-09-11T13:46:03.668Z # create and set access time of file /my/file.txt to "2022-09-11T13:46:03.668Z"
```

# Use Docker

```
docker run \
  -e PORT=8087 \
  -e NAME=toto \
  -e SHOW_ENV=true \
  -p 8087:8087 \
  patatra/test-connections-server:latest
```