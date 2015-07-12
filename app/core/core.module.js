(function() {
	'use strict';

	angular.module('fritzapp.core', [
		'ngRoute',

		'fritzapp.routes',
		'fritzapp.exception',
		'fritzapp.logging',
		'fritzapp.fritzbox',

		'ui.bootstrap',
		'ngStorage'
	]);
})();
