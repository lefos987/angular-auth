'use strict';

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
}]);