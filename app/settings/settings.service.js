(function() {
	'use strict';

	angular.module('fritzapp.settings')

	.factory('Settings', SettingsService);

	/* @ngInject */
	function SettingsService($localStorage) {
		var service = {
			load		: getSettings,
			save		: saveSettings,
			reset 	: resetSettings,
			areSet	: areSet
		};
		var storage = $localStorage;

		return service;

		function getSettings() {
			return storage.settings;
		}

		function saveSettings(settings) {
			storage.settings = settings;
			return storage.settings;
		}

		function resetSettings() {
			delete storage.settings;
		}

		function areSet() {
			return getSettings() !== undefined;
		}
	}
})();
