const { Client } = require("@elastic/elasticsearch");

const URL = process.env.ES_URL || "http://127.0.0.1:9200";

const test = async () => {
  const client = new Client({
    node: URL
  });
  try {
    await client.search({
      index: "my-index",
      body: { foo: "bar" }
    });
  } catch (err) {
    return `Elasticsearch: ${err.name === "ConnectionError" ? "ko" : "ok"}`;
  }

  return `Elasticsearch: ok`;
};

module.exports = test;
