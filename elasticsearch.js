const { Client } = require("@elastic/elasticsearch");

const URL = process.env.ES_URL || "http://127.0.0.1:9200";

const test = async () => {
  const status = {
    host: URL,
    ok: true
  };

  const client = new Client({
    node: URL
  });
  try {
    await client.search({
      index: "my-index",
      body: { foo: "bar" }
    });
  } catch (err) {
    status.ok = err.name !== "ConnectionError";
  }

  return status;
};

module.exports = test;
