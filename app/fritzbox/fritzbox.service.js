(function() {
	'use strict';

	angular.module('fritzapp.fritzbox')

	.factory('FritzBox', FritzBox);

	/* @ngInject */
	function FritzBox(FritzApi, Settings) {
		var service = {
			getDeviceListInfos: getDeviceListInfos,
			setSwitchOn: setSwitchOn,
			setSwitchOff: setSwitchOff
		};

		return service;

		function getDeviceListInfos(callback) {
			executeCommand(function(sid) {
				FritzApi.getDeviceListInfos(sid).success(function(data) {
					callback(data);
				});
			});
		}

		function setSwitchOn(ain, callback) {
			executeCommand(function(sid) {
				FritzApi.setSwitchOn(sid, ain).success(function(data) {
					var state = parseInt(data);
					callback(state);
				});
			});
		}

		function setSwitchOff(ain, callback) {
			executeCommand(function(sid) {
				FritzApi.setSwitchOff(sid, ain).success(function(data) {
					var state = parseInt(data);
					callback(state);
				});
			});
		}

		function executeCommand(callback) {
			if (!service.sid) {
				var settings = Settings.load();
				FritzApi.getSessionID(settings.username, settings.password).success(function(data) {
					service.sid = data;
					callback(service.sid);
				});
			} else {
				callback(service.sid);
			}
		}
	}
})();
