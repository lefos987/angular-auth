'use strict';

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
}]);