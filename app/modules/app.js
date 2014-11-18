// ----- Main app
(function () {
	'use strict';

	angular.module('legolize', [
		'ui.router'
	]);

	angular
		.module('legolize')
		.config(Config)
		.controller('AppCtrl', AppCtrl);

	// Config
	// --------------------------------------------------
	function Config ( $stateProvider, $urlRouterProvider, $httpProvider, $locationProvider ) {
		// use the HTML5 History API
		//$locationProvider.html5Mode(true);

		// Route configs
		// -----------------------------------------------------
		$urlRouterProvider.otherwise('/');

		//TODO: Every controller for routes is being called twice, why?
		// ----- Abstract parent state -----
		var abstract = {
			name: 'app',
			abstract: true,
			templateUrl: 'layouts/default.html',
			controller: 'AppCtrl'
		};

		// ----- Register states -----
		$stateProvider
			.state(abstract);
	}

	// Controller
	// --------------------------------------------------
	function AppCtrl () {
		console.log("AppCtrl");
	}

})();