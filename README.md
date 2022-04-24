# Last.fm Scrobbler
Automatic scrobbler for last.fm
(please ensure the branch of your release coordinates with its respective README.md)
# Configuration
`config.json` can be configured with your last.fm info. Get an api account from [last.fm](https://www.last.fm/api/account/create) and use the api key and secret to configure the program.

## Reccommended Interval
It's reccommended to set `scrobbleInterval` to 25 (seconds), as this seems to be the sweet spot between being rate limited and scrobbling quickly

## Multiple accounts
Scrobbling a single song on multiple accounts in parallel is available. Simply add more account credentials to the arrays in `"credentials"`. Seperate them with commas inside of the brackets as such: `"apiKey": ["API_KEY1", "API_KEY2", "API_KEY3"]`. After all credentials are entered, configure `"accountsNum"` to the number of accounts you've configured credentials for. If any value contains less items than are indicated in `"accountsNum"`, the program will not run.

```json
{
	"credentials": {
		"comment": "Supports scrobbling on multiple accounts, simply add a comma between each option and set \"accountsNum\" to the number of accounts you'd like to scrobble on. For example: \"['APP_KEY 1', 'APP_KEY2']\"",
		"accountsNum": 1,
		"apiKey": ["API_KEY"],
		"apiSecret": ["API_SECRET"],
		"username": ["LAST.FM_USERNAME"],
		"password": ["LAST.FM_PASSWORD"]
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

### Plans for future development
* ability to support multiple songs
* ability to make config.json easier to configure by the user (likely via a dedicated generator) 