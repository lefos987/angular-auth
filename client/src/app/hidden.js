'use strict';

angular.module('hidden', [])

.controller('HiddenCtrl', ['$scope', function ($scope) {
	$scope.title = 'Hidden Page';
	$scope.msg = 'You are not allowed here if you are not registered!!!';
}]);