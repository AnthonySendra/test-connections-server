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
      const {rawData, timings} = await request(
        url.startsWith("https") ? https : http,
        url
      );

      let formattedResponse = rawData;
      try {
        formattedResponse = JSON.parse(rawData)
      } catch (err) {}

      status.push({
        name: name,
        host: url,
        ok: true,
        response: formattedResponse,
        timings
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
  start = process.hrtime.bigint()
  const timings = {
    start: undefined,
    dnsLookupMs: undefined,
    tcpConnectionMs: undefined,
    tlsHandshakeMs: undefined,
    firstByteMs: undefined,
    endMs: undefined,
  }

  return new Promise((resolve, reject) => {
    const req = httpModule
      .get(url, {timeout: 5000}, res => {
        let rawData = "";

        res.once('readable', () => (timings.firstByteAt = Number((process.hrtime.bigint() - start) / 1000000n) ))
        res.on("data", chunk => (rawData += chunk));
        
        res.on('end', () => {
          resolve({
            rawData,
            timings: {
              ...timings, 
              start: Number(start), 
              endMs: Number((process.hrtime.bigint() - start) / 1000000n)
            }
          })
        })
      })

    req.on('socket', (socket) => {
      socket.on('lookup', () => (timings.dnsLookupMs = Number((process.hrtime.bigint() - start) / 1000000n)))
      socket.on('connect', () => (timings.tcpConnectionMs = Number((process.hrtime.bigint() - start) / 1000000n)))
      socket.on('secureConnect', () => (timings.tlsHandshakeMs = Number((process.hrtime.bigint() - start) / 1000000n)))
    })
    
    req.on("error", err => reject(err));
  });
};

module.exports = test;
