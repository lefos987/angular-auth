'use strict';

angular.module('security', [
	'security.interceptor',
	'security.retryBuffer',
	'security.authentication',
	'security.authorization'
]);