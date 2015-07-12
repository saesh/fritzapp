(function() {
	'use strict';

	angular.module('fritzapp.navigation')

	.directive('topNavigation', topNavigation);

	function topNavigation() {
		return {
			name: 'top-navigation',
			restrict: 'E',
			controller: 'TopNavigationController',
			controllerAs: 'vm',
			templateUrl: 'navigation/top-navigation.html'
		};
	}
})();