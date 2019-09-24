const http = require("http");
const testRedis = require("./services/redis");
const testEs = require("./services/elasticsearch");
const testHttpEndpoints = require("./services/httpEndpoints");
const testPostgres = require("./services/postgres");
const testS3 = require("./services/s3");

const port = process.env.PORT || 80;

const requestHandler = async (request, response) => {
  const result = {};
  if (process.env.TEST_REDIS) {
    result.redis = await testRedis();
  }
  if (process.env.TEST_ES) {
    result.elasticsearch = await testEs();
  }
  if (process.env.TEST_POSTGRES) {
    result.postgres = await testPostgres();
  }
  if (process.env.TEST_HTTP) {
    result.http = await testHttpEndpoints();
  }
  if (process.env.TEST_S3) {
    result.s3 = await testS3();
  }

  response.setHeader("Content-Type", "application/json");
  response.end(JSON.stringify(result));
};

const server = http.createServer(requestHandler);

server.listen(port, err => {
  if (err) {
    return console.log("something bad happened", err);
  }

  console.log(`server is listening on ${port}`);
});
