'use strict';

var Hapi = require('hapi');

var indexRoute = {
	method: '*',
	path: '/{path*}',
	config: {
		handler: {
			directory: { path: '../client/dist/', listing: false, index: true }
		}
	}
};

var messagesRoute = {
	method: 'POST',
	path: '/api/{userID}/messages',
	config: {
		handler: function (request, reply) {
			console.log('authenticated?: ', request.payload.isAuthenticated);
			if (!!request.payload.isAuthenticated) {
				reply({messages: [
					{content: 'First Message', from: 'Michael Jordan'},
					{content: 'Second Message', from: 'Michael Jordan'},
					{content: 'Third Message', from: 'Derrick Rose'}
				]});
			}
			else {
				reply(Hapi.error.unauthorized('Missing authentication'));
			}
		}
	}
};

var logoutRoute = {
	method: 'POST',
	path: '/api/logout',
	config: {
		handler: function (request, reply) {
			reply({logout: 'ok'});
		}
	}
};

var loginRoute = {
	method: 'POST',
	path: '/api/login',
	config: {
		handler: function (request, reply) {
			if (request.payload.email === 'elparask@gmail.com' && request.payload.password === '12345') {
				reply({token: 'successToken'});
			}
			else {
				reply(Hapi.error.unauthorized('Unauthenticated user!!!'));
			}
		}
	}
};

module.exports = [indexRoute, messagesRoute, loginRoute, logoutRoute];