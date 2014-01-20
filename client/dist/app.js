'use strict';

angular.module('app', ['templates', 'common', 'ngRoute', 'security', 'login', 'messages', 'hidden'])
	.config(['$routeProvider', '$locationProvider', 'authorizationProvider',
		function ($routeProvider, $locationProvider, authorizationProvider) {
		$routeProvider
			.when('/', {
				templateUrl: 'app/app.view.html',
				controller: 'AppCtrl'
			})
			.when('/messages', {
				templateUrl: 'app/messages.view.html',
				controller: 'MessagesCtrl'
			})
			.when('/hidden', {
				templateUrl: 'app/hidden.view.html',
				controller: 'HiddenCtrl',
				resolve: authorizationProvider.requireAuthenticatedUser
			})
			.when('/login', {
				templateUrl: 'app/login.view.html',
				controller: 'LoginCtrl'
			})
			.otherwise({
				redirectTo: '/'
			});
		$locationProvider.html5Mode(true);
	}])
	.controller('AppCtrl', ['$scope', function ($scope) {
			$scope.message = 'Hello World';
			$scope.templateUrl = 'app/app.view.html';
		}
	]);;'use strict';

angular.module('common', ['dependencies']);;'use strict';

angular.module('dependencies', []);;'use strict';

angular.module('hidden', [])

.controller('HiddenCtrl', ['$scope', function ($scope) {
	$scope.title = 'Hidden Page';
	$scope.msg = 'You are not allowed here if you are not registered!!!';
}]);;'use strict';

angular.module('login', ['security.authentication'])

.controller('LoginCtrl', ['$scope', 'authentication', '$location',
	function ($scope, authentication, $location) {

	$scope.login = function (email, password) {
		console.log('Email is: ', email);
		console.log('Password is: ', password);
		authentication.login(email, password).then(function (suc) {
			console.log('Success success success: ', authentication.token);
			$location.path('/messages');
		}, function (err) {
			console.log('err err err: ', err);
		});
	};
}]);;'use strict';

angular.module('messages', ['security.authentication'])

.controller('MessagesCtrl', ['$scope', '$http', 'authentication',
	function ($scope, $http, authentication) {
	$scope.title = 'My Messages';

	$http.post('/api/test/messages', {isAuthenticated: authentication.isAuthenticated()})
	.then(function (messages) {
		console.log('These are the messages: ', messages);
		$scope.messages = messages.data.messages;
	}, function (err) {
		console.log('This is the error: ', err);
	});

	$scope.logout = function () {
		authentication.logout();
	};
}]);;'use strict';

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
	}]);;'use strict';

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
});;'use strict';

angular.module('security.interceptor', ['security.retryBuffer'])

.factory('securityInterceptor', ['$q', '$injector', 'retryBuffer', function ($q, $injector, buffer) {
	return {
		responseError: function (rejection) {
			if (rejection.status === 401) {
				console.log('I AM INTERCEPTING YOU!!!');
				var retryPromise = buffer.pushRetryFn('unauthorized-server', function retryRequest() {
					var authentication = $injector.get('authentication');
					rejection.config.data.isAuthenticated = authentication.isAuthenticated();
					return $injector.get('$http')(rejection.config);
				});
			}
			return $q.reject(rejection);
		}
	};
}])
.config(['$httpProvider', function ($httpProvider) {
	$httpProvider.interceptors.push('securityInterceptor');
}]);;'use strict';

angular.module('security.retryBuffer', [])

.factory('retryBuffer', ['$injector', '$q', function ($injector, $q) {
	var buffer = [];

	var service = {
		onItemAddedCallbacks: [],
		hasMore: function () {
			return buffer.length > 0;
		},
		retryAll: function () {
			while (service.hasMore()) {
				buffer.shift().retry();
			}
			buffer = [];
		},
		cancelAll: function () {
			while (service.hasMore()) {
				buffer.shift().cancel();
			}
			buffer = [];
		},
		push: function (retryItem) {
			buffer.push(retryItem);
			angular.forEach(service.onItemAddedCallbacks, function (cb) {
				cb(retryItem);
			});
		},
		pushRetryFn: function (reason, retryFn) {
			var deferred = $q.defer();
			var retryItem = {
				reason: reason,
				retry: function () {
					$q.when(retryFn()).then(function (value) {
						deferred.resolve(value);
					}, function (err) {
						deferred.reject(err);
					});
				},
				cancel: function () {
					deferred.reject();
				}
			};
			service.push(retryItem);
			return deferred.promise;
		}
	};
	return service;
}]);;'use strict';

angular.module('security', [
	'security.interceptor',
	'security.retryBuffer',
	'security.authentication',
	'security.authorization'
]);;angular.module('templates', ['app/app.view.html', 'app/hidden.view.html', 'app/login.view.html', 'app/messages.view.html']);

angular.module('app/app.view.html', []).run(['$templateCache', function($templateCache) {
	'use strict';
	$templateCache.put('app/app.view.html',
		'<h1>{{message}}</h1>\n' +
		'<a href="/messages">Messages</a>\n' +
		'<a href="/hidden">Hidden</a>');
}]);

angular.module('app/hidden.view.html', []).run(['$templateCache', function($templateCache) {
	'use strict';
	$templateCache.put('app/hidden.view.html',
		'<h1>{{title}}</h1>\n' +
		'<h3>{{msg}}</h3>');
}]);

angular.module('app/login.view.html', []).run(['$templateCache', function($templateCache) {
	'use strict';
	$templateCache.put('app/login.view.html',
		'Email: <input type="email" ng-model="email">\n' +
		'Password: <input type="password" ng-model="password">\n' +
		'<button ng-click="login(email, password)">Login</button>\n' +
		'');
}]);

angular.module('app/messages.view.html', []).run(['$templateCache', function($templateCache) {
	'use strict';
	$templateCache.put('app/messages.view.html',
		'<h1>{{title}}</h1>\n' +
		'<a href="/">Home</a>\n' +
		'<button ng-click="logout()">Logout</button>\n' +
		'<ul>\n' +
		'	<li ng-repeat="msg in messages">\n' +
		'		<h5>From: {{msg.from}}</h5>\n' +
		'		<p>{{msg.content}}</p>\n' +
		'	</li>\n' +
		'</ul>');
}]);
