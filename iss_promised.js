const request = require('request-promise-native');

//requests the user's ip
//no inputs
//should return a promise for coords by ip
const fetchMyIP = (() => {
    return request('https://api.ipify.org?format=json');
});

//requests to website using fetched ip
//gets lat/long
//input is JSON string w/ ip address
//returns promise for lat/long request
const fetchCoordsByIP = (body) => {
    const ip = JSON.parse(body).ip;
    return request(`https://ipvigilante.com/json/${ip}`);
};

//requests data from website using lat/long coords
//input is JSON body w/ lat/long data
//returns promise for fly over data
const fetchISSFlyOverTimes = (body) => {
    const { latitude, longitude } = JSON.parse(body).data;
    const url = `http://api.open-notify.org/iss-pass.json?lat=${latitude}&lon=${longitude}`;
    return request(url);
}

//returns a promise for flyover data for user's location
const nextISSTimesForMyLocation = (() => {
    return fetchMyIP()
      .then(fetchCoordsByIP)
      .then(fetchISSFlyOverTimes)
      .then((data) => {
        const { response } = JSON.parse(data);
        return response;
      });
  });

module.exports = { nextISSTimesForMyLocation };