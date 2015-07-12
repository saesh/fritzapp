(function() {
	'use strict';

	angular.module('fritzapp.exception')

	.factory('exception', exception);

	/* @ngInject */
	function exception(Logger) {
		var logger = Logger.getInstance('ExceptionCatcher');
		var service = {
			catcher: catcher
		};
		return service;

		function catcher(message) {
			return function(reason) {
				logger.error(message + ': {0}', [reason]);
			};
		}
	}
})();
