const https = require("https");
const http = require("http");

const test = async () => {
  const response = [];
  const endpoints = process.env.HTTP_ENDPOINTS.split(",");

  for (endpoint of endpoints) {
    const [name, url] = endpoint.split("=");
    try {
      await request(url.startsWith("https") ? https : http, url);
      response.push(`${name}(${url}): ok`);
    } catch (err) {
      response.push(`${name}(${url}): ko`);
    }
  }

  return response.join("\n");
};

const request = async (httpModule, url) => {
  return new Promise((resolve, reject) => {
    httpModule
      .get(url, response => {
        response.on("data", () => resolve());
      })
      .on("error", err => reject(err));
  });
};

module.exports = test;
