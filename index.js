const scrobbler = require('./scrobbler.js');
const fs = require('fs');
var scrobblers = [];
console.log('Script Started');
try {
	if (!fs.existsSync('./config.json')) {
		console.log('ERR: Ensure that config.json is present');
		//^ensures config is present
		process.stdin.resume();
		//keeps executable window open
	} else {
		let rawdata = fs.readFileSync('./config.json');
		let config = JSON.parse(rawdata);
		if (
			(config.credentials.apiKey == ['API_KEY']) ||
			(config.credentials.apiSecret == ['API_SECRET']) ||
			(config.credentials.username == ['LAST.FM_USERNAME']) ||
			(config.credentials.password == ['LAST.FM_PASSWORD']) ||
			(config.songinfo.artist == 'ARTIST') ||
			(config.songinfo.track == 'TRACK')
		) {
			console.log('!!config.json is invalid!!');
			console.log(
				'please ensure that config.json has been configured correctly. Reference README.md'
			);
			process.stdin.resume();
		} else {
			function scrobbleSong() {
				scrobblers.forEach((account) => {
					account.Scrobble(config.songinfo);
				});
			}
			if (
				config.credentials.accountsNum &&
				config.credentials.apiKey.length >= config.credentials.accountsNum &&
				config.credentials.apiSecret.length >= config.credentials.accountsNum &&
				config.credentials.username.length >= config.credentials.accountsNum &&
				config.credentials.password.length >= config.credentials.accountsNum
			) {
				//making sure there are enough credentials for the indicated number of parallel accounts
				for (var i = 0; i <= config.credentials.accountsNum - 1; i++) {
					scrobblers.push(
						new scrobbler(
							config.credentials.apiKey[i],
							config.credentials.apiSecret[i],
							config.credentials.username[i],
							config.credentials.password[i]
						)
					); //array generated from Object.values would not work for whatever reason
				} //

				setInterval(scrobbleSong, config.scrobbleInterval * 1000);
			} else {
				console.log(
					'Please ensure that config.json has been configured correctly. There appear to be less account credentials provided than indicated in "accountNum".'
				);
				process.stdin.resume();
			}
		}
	}
} catch (err) {
	console.log(err);
	console.log(
		'There was some sort of fatal error. Please ensure that config.json has been configured correctly or report this issue to https://github.com/acoolindividual/last.fm-automatic-scrobbler/issues.'
	);
	process.stdin.resume();
	//error catching
}