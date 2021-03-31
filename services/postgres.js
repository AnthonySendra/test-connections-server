const { Client } = require("pg");
const sleep = require("../sleep");

const HOST = process.env.POSTGRES_HOST || "127.0.0.1";
const PORT = process.env.POSTGRES_PORT || 5433;

const test = async () => {
  const config = {
    host: HOST,
    port: PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD
  };
  const status = {
    config: {
      host: HOST,
      port: PORT
    },
    ok: true
  };

  try {
    const client = new Client(config);
    await client.connect();
    client.end();
  } catch (error) {
    console.error("Postgres Error", error);
    status.ok = false;
    status.error = error;
  }

  return status;
};

module.exports = test;
