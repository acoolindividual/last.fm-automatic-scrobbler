# Last.fm Scrobbler
Automatic scrobbler for last.fm

# Configuration
`config.json` can be configured with your last.fm info. Get an api account from [last.fm](https://www.last.fm/api/account/create) and use the api key and secret to configure the program.

## Reccommended Interval
It's reccommended to set `scrobbleInterval` to 25 (seconds), as this seems to be the sweet spot between being rate limited and scrobbling quickly

```json
{
  "credentials": {
    "apiKey": "APP_KEY",
    "apiSecret": "APP_SECRET", 
    "username": "USERNAME",
    "password": "PASSWORD"
  },
  "songinfo": {
    "artist": "ARTIST",
    "track": "TRACK",
    "album": "ALBUM"
  }, 
  "scrobbleInterval": "25"
}
```
API responses are logged to the console on every request.
