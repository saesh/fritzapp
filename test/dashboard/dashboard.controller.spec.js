'use strict';

describe('DashboardController with no settings', function() {

	var controller;
	var $location;
	var settings;
	var fritzbox;

	beforeEach(angular.mock.module('fritzapp.dashboard'));
	beforeEach(angular.mock.module('fritzapp.logging'));

	beforeEach(inject(function($controller, _$location_) {
		$location = _$location_;

		// create intial settings mock
		settings = jasmine.createSpyObj('Settings', ['areSet']);
		settings.areSet = jasmine.createSpy('areSet()').and.returnValue(false);

		// create fritzbox mock
		fritzbox = jasmine.createSpyObj('FritzBox', ['getDeviceListInfos']);

		controller = $controller('DashboardController', {'Settings': settings, 'FritzBox': fritzbox});
	}));

	it('creates all mock methods', function() {
		expect(settings.areSet).toBeDefined();
		expect(fritzbox.getDeviceListInfos).toBeDefined();
	});

	it('should be created successfully', function() {
		expect(controller).toBeDefined();
	});

	it('should check if settings are correct', function() {
		expect(settings.areSet).toHaveBeenCalled();
	});

	it('should redirect to the settings page', function() {
		expect($location.path()).toBe('/settings');
	});

	it('should not call FritzBox', function() {
		expect(fritzbox.getDeviceListInfos).not.toHaveBeenCalled();
	});

	it('should have an empty fritzbox view model', function() {
		expect(controller.fritzModel).toBeDefined();
		expect(controller.fritzModel).toEqual({});
	});

	describe('DashboardController with settings', function() {

		beforeEach(inject(function($controller) {
			settings.areSet = jasmine.createSpy('areSet()').and.returnValue(true);
			controller = $controller('DashboardController', {'Settings': settings, 'FritzBox': fritzbox});
		}));

		it('should query the FritzBox for device infos', function() {
			expect(fritzbox.getDeviceListInfos).toHaveBeenCalled();
		});
	});
});
