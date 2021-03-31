const mysql = require("mysql");
const sleep = require("../sleep");

const HOST = process.env.MYSQL_HOST || "127.0.0.1";
const PORT = process.env.MYSQL_PORT || 3306;

const test = async () => {
  const config = {
    host: HOST,
    port: PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database:  process.env.MYSQL_DB,
  }

  const status = {
    config: {
      host: HOST,
      port: PORT
    },
    ok: true
  };

  try {
    const connection = mysql.createConnection(config);
    await new Promise((resolve, reject) => {
      connection.connect((err) => {
        if (err) {
          return reject(err)
        }
        resolve()
      });
    })

    await new Promise((resolve, reject) => {
      connection.query("SELECT 1", (err) => {
        if (err) {
          return reject(err)
        }
        resolve()
      });
    })
    
    connection.end();
  } catch (error) {
    console.error("MySQL Error", error);
    status.ok = false;
    status.error = error;
  }

  return status;
};

module.exports = test;
