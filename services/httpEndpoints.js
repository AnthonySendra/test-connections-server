const https = require("https");
const http = require("http");

const test = async () => {
  const status = [];
  let endpoints = []

  if (!!process.env.HTTP_ENDPOINTS) {
    endpoints = process.env.HTTP_ENDPOINTS.split(",");
  } else {
    endpoints = ["default=" + process.env.HTTP_ENDPOINT]
  }

  for (endpoint of endpoints) {
    const [name, url] = endpoint.split("=");
    try {
      const response = await request(
        url.startsWith("https") ? https : http,
        url
      );

      let formattedResponse = response;
      try {
        formattedResponse = JSON.parse(response);
      } catch (err) {}

      status.push({
        name: name,
        host: url,
        ok: true,
        response: formattedResponse
      });
    } catch (error) {
      console.error("HTTP Error", error);
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
      .get(url, {timeout: 5000}, response => {
        let rawData = "";
        response.on("data", chunk => (rawData += chunk));
        response.on("end", () => resolve(rawData));
      })
      .on("error", err => reject(err));
  });
};

module.exports = test;
