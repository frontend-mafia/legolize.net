// ----- Main app
(function () {
	'use strict';

	angular.module('app', [
		'app.home',
		'ui.router'
	]);

	angular
		.module('app')
		.config(Config)
		.controller('AppCtrl', AppCtrl);

	// Config
	// --------------------------------------------------
	function Config ( $stateProvider, $urlRouterProvider, $httpProvider, $locationProvider ) {
		// use the HTML5 History API
		//$locationProvider.html5Mode(true);

		// Route configs
		// -----------------------------------------------------

		// ----- Abstract parent state -----
		var abstract = {
			name: 'app',
			abstract: true,
			templateUrl: 'templates/default.html',
			controller: 'AppCtrl'
		};

		// ----- Register states -----
		$stateProvider
			.state(abstract);

		$urlRouterProvider.otherwise('/');
	}

	// Controller
	// --------------------------------------------------
	function AppCtrl () {
		console.log("AppCtrl");
	}

})();