(function() {
	'use strict';

	angular.module('fritzapp.settings')

	.controller('SettingsController', SettingsController);

	/* @ngInject */
	function SettingsController(Settings) {
		var vm = this;
		vm.loginModel = null;
		vm.saveSettings = saveSettings;
		vm.forgetSettings = forgetSettings;
		vm.debug = false;

		init();

		function init() {
			loadSettings();
		}

		function saveSettings() {
			Settings.save(vm.loginModel);
			vm.settingsSaved = true;
		}

		function loadSettings() {
			vm.loginModel = Settings.load();
		}

		function forgetSettings() {
			Settings.reset();
			loadSettings();
		}
	}
})();
