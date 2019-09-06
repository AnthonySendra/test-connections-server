const redis = require("redis");
const sleep = require("./sleep");

const HOST = process.env.REDIS_HOST || "127.0.0.1";
const PORT = process.env.REDIS_PORT || 6379;

const test = async () => {
  const errors = [];
  const client = redis.createClient({
    host: HOST,
    port: PORT
  });
  client.on("error", function(err) {
    errors.push(err);
  });

  await sleep();
  client.quit();

  return {
    host: `${HOST}:${PORT}`,
    ok: !errors.length
  };
};

module.exports = test;
