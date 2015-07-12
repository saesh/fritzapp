(function() {
	'use strict';

	angular
		.module('fritzapp.routes', [
			'ngRoute'
			])

		.config(routeConfig);

		/* @ngInject */
		function routeConfig($routeProvider) {
			$routeProvider
        .when('/dashboard', { templateUrl: 'dashboard/dashboard.html', title: 'dashboard'})
        .when('/settings', { templateUrl: 'settings/settings.html', title: 'settings'})
        .otherwise({ redirectTo: '/dashboard' });
		}
})();
