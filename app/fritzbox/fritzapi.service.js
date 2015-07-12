(function() {
	'use strict';

	angular.module('fritzapp.fritzbox')

	.factory('FritzApi', FritzApi);

	/* @ngInject */
	function FritzApi($http) {
		var service = {
			getSessionID: getSessionID,
			checkSession: checkSession,
			getSwitchList: getSwitchList,
			getDeviceListInfos: getDeviceListInfos,
			setSwitchOn: setSwitchOn,
			setSwitchOff: setSwitchOff,
		};
		return service;

		function getSessionID(username, password) {
    	return $http.get('/api/getSessionID', {params: {'username': escape(username), 'password': escape(password)}});
		}

		function checkSession(sid) {
  		return $http.get('/api/checkSession', {params: {'sid': escape(sid)}});
		}

		function getSwitchList(sid) {
			return $http.get('/api/getSwitchList', {params: {'sid': escape(sid)}});
		}

		function getDeviceListInfos(sid) {
			return $http.get('/api/getDeviceListInfos', {params: {'sid': escape(sid)}});
		}

		function setSwitchOn(sid, ain) {
			return $http.get('/api/setSwitchOn', {params: {'sid': escape(sid), 'ain': escape(ain)}});
		}

		function setSwitchOff(sid, ain) {
			return $http.get('/api/setSwitchOff', {params: {'sid': escape(sid), 'ain': escape(ain)}});
		}
	}
})();
