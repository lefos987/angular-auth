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
	]);