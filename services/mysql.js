const mysql = require('mysql2/promise');

const HOST = process.env.MYSQL_HOST || '127.0.0.1';
const PORT = Number(process.env.MYSQL_PORT || 3306);

const test = async () => {
  const config = {
    host: HOST,
    port: PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB,

    connectTimeout: 10_000,
    enableKeepAlive: true,
    timezone: 'Z',
    decimalNumbers: true,
  };

  if (process.env.MYSQL_SSL === '1' || String(process.env.MYSQL_SSL).toLowerCase() === 'true') {
    config.ssl = {
      // For production, provide proper CA; this keeps DX simple by allowing env override
      rejectUnauthorized: process.env.MYSQL_SSL_REJECT_UNAUTHORIZED !== '0',
    };
  }

  const status = {
    config: { host: HOST, port: PORT },
    timings: {
      connectDurationMs: undefined,
      selectDurationMs: undefined,
    },
    ok: true,
  };

  let connection;
  try {
    let startConnect = process.hrtime.bigint();
    connection = await mysql.createConnection(config);
    status.timings.connectDurationMs = Number((process.hrtime.bigint() - startConnect) / 1000000n);

    // Simple no-op query to validate round-trip
    let startSelect = process.hrtime.bigint();
    await connection.execute('SELECT 1');
    status.timings.selectDurationMs = Number((process.hrtime.bigint() - startSelect) / 1000000n);
  } catch (error) {
    console.error('MySQL Error', error);
    status.ok = false;
    status.error = {
      message: error.message,
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState,
    };
  } finally {
    if (connection) {
      try {
        await connection.end();
      } catch (_) {
        // swallow close errors
      }
    }
  }

  return status;
};

module.exports = test;
