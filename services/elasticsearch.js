const { Client } = require("@elastic/elasticsearch");

const URL = process.env.ES_URL || "http://127.0.0.1:9200";

const test = async () => {
  const status = {
    host: URL,
    ok: true
  };

  try {
    const client = new Client({
      node: URL,
      maxRetries: 5,
      requestTimeout: 1000
    });
    await client.search({
      index: "my-index",
      body: { foo: "bar" }
    });
  } catch (err) {
    console.error("Elasticsearch Error", error);
    status.ok = err.name === "ResponseError";
  }

  return status;
};

module.exports = test;
