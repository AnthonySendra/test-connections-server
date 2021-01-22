const http = require("http");
const os = require("os");
const testRedis = require("./services/redis");
const testEs = require("./services/elasticsearch");
const testHttpEndpoints = require("./services/httpEndpoints");
const testPostgres = require("./services/postgres");
const testS3 = require("./services/s3");

const port = process.env.PORT || 80;
const name = process.env.NAME || Math.random().toString(36).substring(7);

const requestHandler = async (request, response) => {
  console.log("test connection begin");
  
  const result = {};
  if (process.env.TEST_REDIS) {
    console.log("test redis");
    result.redis = await testRedis();
  }
  if (process.env.TEST_ES) {
    console.log("test es");
    result.elasticsearch = await testEs();
  }
  if (process.env.TEST_POSTGRES) {
    console.log("test postgres");
    result.postgres = await testPostgres();
  }
  if (process.env.TEST_HTTP) {
    console.log("test http");
    result.http = await testHttpEndpoints();
  }
  if (process.env.TEST_S3) {
    console.log("test s3");
    result.s3 = await testS3();
  }
  
  result.hostname = os.hostname();
  result.name = name;

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

if (process.env.SECOND_PORT) {
  const server2 = http.createServer(requestHandler);
  server2.listen(process.env.SECOND_PORT, err => {
    if (err) {
      return console.log("something bad happened", err);
    }

    console.log(`server is listening on ${process.env.SECOND_PORT}`);
  });
}
