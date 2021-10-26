const https = require("https");
const url = "https://ipinfo.io";

const getProvider = async () => {
  try {
    const response = await request(https, url);
    let formattedResponse = response;
    
    try {
      formattedResponse = JSON.parse(response);
      return formattedResponse
    } catch (err) {
      return {error: err}
    }
  } catch (error) {
    return {error: err}
  }
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

module.exports = getProvider;
