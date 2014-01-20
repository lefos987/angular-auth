angular.module('templates', ['app/app.view.html', 'app/hidden.view.html', 'app/login.view.html', 'app/messages.view.html']);

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
