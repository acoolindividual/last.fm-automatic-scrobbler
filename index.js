const scribble = require("scribble");
const fs = require("fs");
console.log("Script Started");
if(!fs.existsSync("./config.json")){
  console.log("ERR: Ensure that config.json is present");
} else {
let rawdata = fs.readFileSync("./config.json");
let config = JSON.parse(rawdata);
const scrobbler = new scribble(
  config.credentials.apiKey,
  config.credentials.apiSecret,
  config.credentials.username,
  config.credentials.password
); //array generated from Object.values would not work for whatever reason
function scrobbleSong() {
  scrobbler.Scrobble(config.songinfo);
}
setInterval(scrobbleSong, config.scrobbleInterval * 1000);
}