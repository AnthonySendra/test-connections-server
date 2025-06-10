const http = require("http");
const dgram = require("dgram");
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

const runConnectionTests = async (query = {}) => {
  const result = {};
  
  if (process.env.REDIS_HOST) {
    console.log("test redis");
    result.redis = await testRedis();
  }
  if (process.env.ES_URL) {
    console.log("test es");
    result.elasticsearch = await testEs();
  }
  if (process.env.POSTGRES_HOST) {
    console.log("test postgres");
    result.postgres = await testPostgres();
  }
  if (process.env.MYSQL_HOST) {
    console.log("test mysql");
    result.mysql = await testMysql();
  }
  if (process.env.HTTP_ENDPOINTS) {
    console.log("test http");
    result.http = await testHttpEndpoints();
  }
  if (process.env.S3_BUCKET_NAME) {
    console.log("test s3");
    result.s3 = await testS3();
  }
  if (process.env.TOUCH) {
    console.log("touch file");
    result.touch = await touch(query);
  }
  if (process.env.LS_DIR) {
    console.log("ls directory");
    result.ls = await lsDir();
  }
  
  if (query && query.fibonacci) {
    result.fibonacci = fibonacci(parseInt(query.fibonacci, 10));
  }
  
  result.hostname = os.hostname();
  result.name = name;

  if (process.env.SHOW_IP_INFO) {
    result.ipinfo = await getIpInfo();
  }

  if (process.env.SHOW_ENV) {
    result.envVariables = process.env;
  }

  return result;
};

const requestHandler = async (request, response) => {
  console.log("test connection begin");
  
  const query = url.parse(request.url, true).query;
  const result = await runConnectionTests(query);

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

  // UDP Server
  if (process.env.UDP_PORT) {
    const udpServer = dgram.createSocket('udp4');
    
    udpServer.on('message', async (msg, rinfo) => {
      console.log(`UDP message received from ${rinfo.address}:${rinfo.port}`);
      
      try {
        // Parse the message as JSON to extract query parameters
        let query = {};
        try {
          const messageData = JSON.parse(msg.toString());
          query = messageData.query || {};
        } catch (e) {
          // If not JSON, treat as simple string
          console.log(`UDP message content: ${msg.toString()}`);
        }

        // Run the same tests as HTTP server
        const result = await runConnectionTests(query);

        // Send response back to client
        const response = JSON.stringify(result);
        udpServer.send(response, rinfo.port, rinfo.address, (err) => {
          if (err) {
            console.log(`UDP response error: ${err}`);
          } else {
            console.log(`UDP response sent to ${rinfo.address}:${rinfo.port}`);
          }
        });
        
      } catch (error) {
        console.log(`UDP processing error: ${error}`);
        const errorResponse = JSON.stringify({ error: error.message });
        udpServer.send(errorResponse, rinfo.port, rinfo.address);
      }
    });

    udpServer.on('error', (err) => {
      console.log(`UDP server error: ${err}`);
      udpServer.close();
    });

    udpServer.on('close', () => {
      console.log('UDP server closed');
    });

    try {
      udpServer.bind(process.env.UDP_PORT, '0.0.0.0', () => {
        console.log(`UDP server listening on port ${process.env.UDP_PORT}`);
      });
    } catch (err) {
      console.log(`UDP server bind error: ${err}`);
    }
  }
}, waitBeforeStartServer)