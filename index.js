const http = require("http");
const testRedis = require("./redis");
const testEs = require("./elasticsearch");
const httpEndpoints = require("./httpEndpoints");

const port = process.env.PORT || 80;

const requestHandler = async (request, response) => {
  const result = {};
  if (process.env.TEST_REDIS) {
    result.redis = await testRedis();
  }
  if (process.env.TEST_ES) {
    result.elasticsearch = await testEs();
  }
  if (process.env.TEST_HTTP) {
    result.http = await httpEndpoints();
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
