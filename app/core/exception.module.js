(function() {
	'use strict';

	angular.module('fritzapp.exception', [])

	.config(exceptionConfig);

	function exceptionConfig ($provide) {
		$provide.decorator('$exceptionHandler', extendExceptionHandler);
	}

	/* @ngInject */
	function extendExceptionHandler ($delegate, exception) {
		return function(excp, cause) {
			$delegate(excp, cause);

			var errorData = {
				exception: excp,
				cause: cause
			};

			exception.catcher("Caught unhandled exception: " + excp.msg)(errorData);
		};
	}
})();
