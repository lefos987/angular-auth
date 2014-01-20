'use strict';

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
}]);