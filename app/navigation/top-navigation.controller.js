(function() {
	'use strict';

	angular.module('fritzapp.navigation')

	.controller('TopNavigationController', TopNavigationController);

	/* @ngInject */
	function TopNavigationController($location) {
		var vm = this;
		vm.isActive = isActive;

		function isActive(path) {
			return path === $location.path();
		}
	}
})();
