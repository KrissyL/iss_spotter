const request = require('request');
const address = 'https://api.ipify.org/?format=json';
// makes an api request to get user's IP address
// * input:
// * -a callback (pass an error or IP string)
// * returns (via callback):
//  -an error, if any (nullable)
//  -the IP address as a string (null if error). like: "127.0.0.1"
const fetchMyIP = function(callback) {
  request('https://api.ipify.org?format=json', (error, response, body) => {
    if (error) return callback(error, null);

    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching IP: ${body}`), null);
      return;
    }

    const ip = JSON.parse(body).ip;
    callback(null, ip);
  });
};
// will get latitude and longitude coordinates once given an ip to pass through
const fetchCoordsByIP = function(ip, callback) {
  request(`https://ipvigilante.com/json/${ip}`, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }

    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching Coordinates for IP: ${body}`), null);
      return;
    }

    const { latitude, longitude } = JSON.parse(body).data;
    // parses the data

    callback(null, { latitude, longitude });
  });
};

// makes an api request to get the upcoming ISS fly over times for the given lat/long coords
// * input:
//  -an object with keys "latitude" and "longitude"
//  -a callback (to pass back an error or the array of resulting data)
// * returns (via callback)
//  -an error, if any (nullable)
//  -the fly over times as an array of objects (null if error) example:
//  [ { risetime: 134564234, duration: 600 }, ...]
const fetchISSFlyOverTimes = (coords, callback) => {
  const address = `http://api.open-notify.org/iss-pass.json?lat=${coords.latitude}&lon=${coords.longitude}`;
  request(address, (error, response, body) => {
    if (error) return callback(error, null);

    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching coordinates. Response: ${body}`;
      callback(Error(msg), null);
      return;
    } else {
      const whenItPasses = JSON.parse(body).response;
      callback(null, whenItPasses);
    }
  });
};

const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }

    fetchCoordsByIP(ip, (error, loc) => {
      if (error) {
        return callback(error, null);
      }

      fetchISSFlyOverTimes(loc, (error, nextPasses) => {
        if (error) {
          return callback(error, null);
        }

        callback(null, nextPasses);
      });
    });
  });
};

// Only export nextISSTimesForMyLocation and not the other three (API request) functions.
// This is because they are not needed by external modules.
module.exports = { nextISSTimesForMyLocation };