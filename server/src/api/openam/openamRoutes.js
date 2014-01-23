'use strict';
var req = require('request');

var openamRoute = {
	method: 'GET',
	path: '/api/openam',
	config: {
		handler: function (request, reply) {
			var url = 'http://sso1.testserver.com:8080/oneid/oauth2/authorize',
			responseType = 'code',
			scope = encodeURIComponent('openid profile'),
			clientId = 'AngularDemo',
			state = 'af0ifjsldkj',
			redirectUri = 'http://localhost:50000/cb';
			req.get(url + '?response_type=' + responseType +
				'&scope=' + scope +
				'&client_id=' + clientId +
				'&redirect_uri=' + redirectUri +
				'&state=' + state,
				function (err, response, body) {
					console.log('response: ', response);
				});
		}
	}
};

var cbRoute = {
	method: 'GET',
	path: '/cb',
	config: {
		handler: function (request, reply) {
			console.log('CB REPLY: ', reply);
			reply({hi: 'cam'});
		}
	}
};

module.exports = [openamRoute, cbRoute];

//http://sso1.testserver.com:8080/oneid/oauth22/authorize?response_type=code&scope=openid&client_id=AngularDemo&redirect_uri=http://localhost:50000/cb