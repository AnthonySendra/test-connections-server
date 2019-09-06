const redis = require("redis");
const sleep = require("./sleep");

const test = async () => {
  const errors = [];
  const client = redis.createClient({
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: process.env.REDIS_PORT || 6379
  });
  client.on("error", function(err) {
    errors.push(err);
  });

  await sleep();
  client.quit();

  return `Redis: ${errors.length ? "ko" : "ok"}`;
};

module.exports = test;
