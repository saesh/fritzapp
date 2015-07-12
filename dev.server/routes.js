var fritz     = require('smartfritz');
var xmlparser = require('xml2json');

module.exports = function(app) {

	app.get('/api/getSessionID', getSessionID);
	app.get('/api/checkSession', checkSession);
	app.get('/api/getSwitchList', getSwitchList);
	app.get('/api/getDeviceListInfos', getDeviceListInfos);
	app.get('/api/setSwitchOn', setSwitchOn);
	app.get('/api/setSwitchOff', setSwitchOff);

	function getSessionID(req, res, next) {
		var username = req.query.username;
		var password = req.query.password;

		fritz.getSessionID(username, password, success);

		function success(data) {
			res.send(data);
		}
	}

	function checkSession(req, res, next) {
		var sid = req.query.sid;

		fritz.checkSession(sid, success);

		function success(data) {
			res.send(data);
		}
	}

	function setSwitchOn(req, res, next) {
		var sid = req.query.sid;
		var ain = req.query.ain;

		fritz.setSwitchOn(sid, ain, success);

		function success(data) {
			res.send(data);
		}
	}

	function setSwitchOff(req, res, next) {
		var sid = req.query.sid;
		var ain = req.query.ain;

		fritz.setSwitchOff(sid, ain, success);

		function success(data) {
			res.send(data);
		}
	}

	function getSwitchList(req, res, next) {
		var sid = req.query.sid;

		fritz.getSwitchList(sid, success);

		function success(data) {
			res.send(data);
		}
	}

	function getDeviceListInfos(req, res, next) {
		var sid = req.query.sid;

		fritz.getDeviceListInfos(sid, success);

		function success(xml) {
			var jsonData = xmlparser.toJson(
																xml,
																{
																	object: true,
																	reversible: false,
																	coerce: true,
																	sanitize: true,
																	trim: true,
																	arrayNotation: false
																});

			// Ist nur ein Gerät vorhanden wird es nicht in ein Array gepackt sondern einzeln
			// übertragen. Ist dies der Fall so wird es in ein Array gekapselt. Erleichtert das
			// iterieren auf der Clientseite.
			if (Object.prototype.toString.call(jsonData.devicelist.device) === '[object Object]') {
				jsonData.devicelist.device = [jsonData.devicelist.device];
			}

			res.send(jsonData);
		}
	}
};
