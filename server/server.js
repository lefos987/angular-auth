'use strict';

var Hapi = require('hapi'),
		config = require('./config'),
		indexRoutes = require('./src/api/index/indexRoutes'),
		openamRoutes = require('./src/api/openam/openamRoutes');

var options = {
	cors: true,
	cache: {
		engine: 'redis',
		partition: 'cm'
	}
};

var server = Hapi.createServer('0.0.0.0', config.port, options);


server.route(indexRoutes);
server.route(openamRoutes);

server.start();
console.log('Hapi server running in port ' + config.port);

module.exports = server;