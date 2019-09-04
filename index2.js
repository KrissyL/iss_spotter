const { nextISSTimesForMyLocation } = require('./iss_promised');
const { printPassTimes } = require('./index');

//fetches fly over times for user's area
nextISSTimesForMyLocation()
    .then((passTimes) => {
        printPassTimes(passTimes);
    })
    .catch((error) => {
        console.log("It didn't work: ", error.message);
    });