const http = require("http");
const testRedis = require("./redis");

const port = 3000;

const requestHandler = async (request, response) => {
  const responses = ["Hello Node.js Server!"];
  if (process.env.TEST_REDIS) {
    responses.push(await testRedis());
  }

  response.end(responses.join("\n"));
};

const server = http.createServer(requestHandler);

server.listen(port, err => {
  if (err) {
    return console.log("something bad happened", err);
  }

  console.log(`server is listening on ${port}`);
});
