const mysql = require("mysql2/promise");
const sleep = require("../sleep");

const HOST = process.env.MYSQL_HOST || "127.0.0.1";
const PORT = process.env.MYSQL_PORT || 3306;

const test = async () => {
  const config = {
    host: HOST,
    port: PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB,
    // Add MySQL 9 compatibility options
    authPlugins: {
      mysql_clear_password: () => () => Buffer.from(process.env.MYSQL_PASSWORD || ''),
    },
    // Enable support for newer MySQL features
    supportBigNumbers: true,
    bigNumberStrings: true,
  }

  const status = {
    config: {
      host: HOST,
      port: PORT
    },
    timings: {
      connectDurationMs: undefined,
      selectDurationMs: undefined,
    },
    ok: true
  };

  try {
    const startConnect = process.hrtime.bigint();
    const connection = await mysql.createConnection(config);
    status.timings.connectDurationMs = Number((process.hrtime.bigint() - startConnect) / 1000000n);

    const startSelect = process.hrtime.bigint();
    await connection.execute("SELECT 1");
    status.timings.selectDurationMs = Number((process.hrtime.bigint() - startSelect) / 1000000n);
    
    await connection.end();
  } catch (error) {
    console.error("MySQL Error", error);
    status.ok = false;
    status.error = error;
  }

  return status;
};

module.exports = test;
