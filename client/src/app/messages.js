'use strict';

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
}]);