var http = require('http'),
	crypto = require('crypto'),
	querystring = require('querystring');

var Scribble = function (api_key, api_secret, username, password) {
	this.apiKey = api_key;
	this.apiSecret = api_secret;
	this.username = username;
	this.password = password;
	this.sessionKey = null;
};
Scribble.prototype.Scrobble = function (song, callback) {
	var self = this;
	if (self.sessionKey == null) {
		self.MakeSession(function (sk) {
			postScrobble(self, song, sk, callback);
		});
	} else {
		postScrobble(self, song, self.sessionKey, callback);
	}
};
Scribble.prototype.MakeSession = function (callback) {
	var token = makeHash(this.username + makeHash(this.password)),
		apiSig = makeHash(
			'api_key' +
				this.apiKey +
				'authToken' +
				token +
				'methodauth.getMobileSessionusername' +
				this.username +
				this.apiSecret
		),
		path =
			'/2.0/?method=auth.getMobileSession&' +
			'username=' +
			this.username +
			'&authToken=' +
			token +
			'&api_key=' +
			this.apiKey +
			'&api_sig=' +
			apiSig +
			'&format=json';
	sendGet(path, function (ret) {
		Scribble.sessionKey = ret.session.key;
		if (typeof callback == 'function') callback(ret.session.key);
	});
};
function postScrobble(self, song, sk, callback) {
	if (sk && self.sessionKey == null) {
		self.sessionKey = sk;
	}
	var now = new Date().getTime(),
		timestamp = Math.floor(now / 1000),
		apiSig = makeHash(
			'api_key' +
				self.apiKey +
				'artist' +
				song.artist +
				'methodtrack.scrobblesk' +
				self.sessionKey +
				'timestamp' +
				timestamp +
				'track' +
				song.track +
				self.apiSecret
		),
		post_data = querystring.stringify({
			method: 'track.scrobble',
			api_key: self.apiKey,
			sk: self.sessionKey,
			api_sig: apiSig,
			timestamp: timestamp,
			artist: song.artist,
			track: song.track,
		});
	sendPost(post_data, callback);
}
function sendPost(data, callback) {
	var options = {
			host: 'ws.audioscrobbler.com',
			path: '/2.0/',
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Content-Length': data.length,
			},
		},
		doPOST = http
			.request(options, function (request) {
				var reqReturn = '';
				request.setEncoding('utf8');
				request.on('data', function (chunk) {
					reqReturn += chunk;
				});
				request.on('end', function () {
					console.log('[POST RESPONSE] : ' + reqReturn);
					if (typeof callback == 'function') callback(reqReturn);
				});
			})
			.on('error', function (err) {
				// TODO
			});
	doPOST.write(data);
	doPOST.end();
}
function sendGet(path, callback) {
	var response = '',
		apiCall = {
			host: 'ws.audioscrobbler.com',
			port: 80,
			path: path,
		};
	http.get(apiCall, function (res) {
		res.on('data', function (chunk) {
			try {
				response += chunk;
			} catch (err) {
				// TODO
				console.log(err);
			}
		});
		res.on('end', function () {
			try {
				var ret = JSON.parse(response);
				//var ret = response
				if (typeof callback == 'function') callback(ret);
			} catch (err) {
				// TODO
				console.log('[INVALID RETURN] the return was invalid JSON: ' + err);
			}
		});
	}).on('error', function (err) {
		console.log(err.message);
	});
}
function makeHash(input) {
	return crypto.createHash('md5').update(input, 'utf8').digest('hex');
}

module.exports = Scribble;