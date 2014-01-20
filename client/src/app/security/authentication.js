'use strict';

angular.module('security.authentication', ['security.retryBuffer'])

.factory('authentication', ['$http', '$q', '$location', 'retryBuffer',
	function ($http, $q, $location, buffer) {
		buffer.onItemAddedCallbacks.push(function (retryItem) {
			if (buffer.hasMore()) {
				$location.path('/login');
			}
		});

		var service = {
			login: function (email, password) {
				var request = $http.post('/api/login', {
					email: email,
					password: password
				});
				return request.then(function (response) {
					service.token = response.data.token;
					if (service.isAuthenticated()) {
						service.closeLogin();
					}
					return service.isAuthenticated();
				}, function (err) {
					console.log('Error response from Login: ', err);
				});
			},
			logout: function (url) {
				$http.post('/api/logout').then(function () {
					service.token = null;
					$location.path('/');
				});
			},
			closeLogin: function () {
				buffer.retryAll();
			},
			isAuthenticated: function () {
				return !!service.token;
			},
			token: null
		};

		return service;
	}]);