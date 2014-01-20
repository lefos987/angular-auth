'use strict';

angular.module('security.authorization', ['security'])

.provider('authorization', {
	requireAuthenticatedUser: ['authorization', function (authorization) {
		return authorization.requireAuthenticatedUser();
	}],

	$get: ['authentication', 'retryBuffer', function (authentication, buffer) {
		var service = {
			requireAuthenticatedUser: function () {
				if (!authentication.isAuthenticated()) {
					return buffer.pushRetryFn('unauthenticated-client', service.requireAuthenticatedUser);
				}
			}
		};
		return service;
	}]
});