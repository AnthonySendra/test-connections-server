const https = require("https");
const http = require("http");

const test = async () => {
  const status = [];
  const endpoints = process.env.HTTP_ENDPOINTS.split(",");

  for (endpoint of endpoints) {
    const [name, url] = endpoint.split("=");
    try {
      const response = await request(
        url.startsWith("https") ? https : http,
        url
      );
      status.push({
        name: name,
        host: url,
        ok: true,
        response: response
      });
    } catch (err) {
      status.push({
        name: name,
        host: url,
        ok: false
      });
    }
  }

  return status;
};

const request = async (httpModule, url) => {
  return new Promise((resolve, reject) => {
    httpModule
      .get(url, response => {
        let rawData = "";
        response.on("data", chunk => (rawData += chunk));
        response.on("end", () => resolve(rawData));
      })
      .on("error", err => reject(err));
  });
};

module.exports = test;
