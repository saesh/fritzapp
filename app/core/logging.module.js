(function() {
	'use strict';

	angular.module('fritzapp.logging', [])

	.config(configureLogging);

	/* @ngInject */
	function configureLogging($logProvider, LoggerProvider) {
		var isDevMode = isDevelopment();
		$logProvider.debugEnabled(isDevMode);
		LoggerProvider.enabled(isDevMode);
	}

	function isDevelopment() {
		return window.location.host.split(':')[0] === 'localhost';
	}
})();
