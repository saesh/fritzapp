(function() {
	'use strict';

	angular.module('fritzapp.dashboard')

	.controller('DashboardController', Dashboard);

	/* @ngInject */
	function Dashboard($location, Settings, FritzBox, Logger) {
		var vm = this;
		vm.fritzModel = {};
		vm.powerSwitchClicked = powerSwitchClicked;
		vm.debug = false;

		init();

		function init() {
			if (!Settings.areSet()) {
				$location.path('/settings');
				return;
			}

			getDeviceListInfos();
		}

		function getDeviceListInfos() {
			FritzBox.getDeviceListInfos(getDeviceListInfosSuccess);

			function getDeviceListInfosSuccess(data) {
				var deviceInfos = data;
				vm.fritzModel.deviceInfos = deviceInfos;
			}
		}

		function powerSwitchClicked(device) {

			switch(device.switch.state) {
				case 0:
					FritzBox.setSwitchOff(device.identifier, switchClickedSuccess);
					break;
				case 1:
					FritzBox.setSwitchOn(device.identifier, switchClickedSuccess);
					break;
			}

			function switchClickedSuccess(data) {
				var actualState = data;
				device.switch.state = actualState;
			}
		}
	}
})();
