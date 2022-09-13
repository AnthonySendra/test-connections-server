const http = require("http");
const url = require("url");
const os = require("os");
const testRedis = require("./services/redis");
const testEs = require("./services/elasticsearch");
const testHttpEndpoints = require("./services/httpEndpoints");
const testPostgres = require("./services/postgres");
const testMysql = require("./services/mysql");
const testS3 = require("./services/s3");
const fibonacci = require("./services/fibonacci");
const getIpInfo = require("./services/getIpInfo");
const lsDir = require("./services/ls");
const touch = require("./services/touch");

const port = process.env.PORT || 80;
const name = process.env.NAME || Math.random().toString(36).substring(7);
const waitBeforeStartServer = process.env.WAIT ? parseInt(process.env.WAIT, 10) : 0

const requestHandler = async (request, response) => {
  console.log("test connection begin");
  
  const query = url.parse(request.url, true).query;

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
  if (process.env.TEST_MYSQL) {
    console.log("test mysql");
    result.mysql = await testMysql();
  }
  if (process.env.TEST_HTTP) {
    console.log("test http");
    result.http = await testHttpEndpoints();
  }
  if (process.env.TEST_S3) {
    console.log("test s3");
    result.s3 = await testS3();
  }
  if (process.env.TOUCH) {
    console.log("touch file");
    result.touch = await touch(query)
  }
  if (process.env.LS_DIR) {
    console.log("ls directory");
    result.ls = await lsDir() 
  }
  
  if (query && query.fibonacci) {
    result.fibonacci = fibonacci(parseInt(query.fibonacci, 10))
  }
  
  result.hostname = os.hostname();
  result.name = name;

  if (process.env.SHOW_IP_INFO) {
    result.ipinfo = await getIpInfo()
  }

  if (process.env.SHOW_ENV) {
    result.envVariables = process.env
  }

  response.setHeader("Content-Type", "application/json");
  response.end(JSON.stringify(result));
};

const server = http.createServer(requestHandler);

setTimeout(() => {
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
}, waitBeforeStartServer)