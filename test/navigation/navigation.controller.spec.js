'use strict';

describe('TopNavigationController', function() {
	var $location, controller;

	beforeEach(module('fritzapp.navigation'));

	beforeEach(inject(function($controller, _$location_) {
		$location = _$location_;
		controller = $controller('TopNavigationController', {});
	}));

	it('should be created successfully', function() {
		expect(controller).toBeDefined();
	});

	it('should have a method to check if the path is active', function() {
		expect(controller.isActive).toBeDefined();
	});

	it('should return true if the location is "/dashoboard"', function() {
		$location.path('/dashboard');
		expect(controller.isActive('/dashboard')).toBe(true);
	});

	it('should return false if the location is not "/dashoboard"', function() {
		$location.path('/nonexistent');
		expect(controller.isActive('/dashboard')).toBe(false);
	});
});
