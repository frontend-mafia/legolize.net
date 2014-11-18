// ----- Home module -----
(function () {
	'use strict';

	angular.module(
		'app.home', [

		]);

	angular
		.module('app')
		.config(Config);

	// Config
	// --------------------------------------------------
	function Config ( $stateProvider, $urlRouterProvider ) {
		// use the HTML5 History API
		//$locationProvider.html5Mode(true);

		// Route configs
		// -----------------------------------------------------

		// ----- Abstract parent state -----
		var abstract = {
			name: 'app.home',
			url: '^',
			abstract: true,
			templateUrl: 'modules/home/views/home.html',
			controller: 'HomeCtrl'
		};

		// ----- Child states -----
		var index = {
			name: 'app.home.index',
			url: '/',
			templateUrl: 'modules/home/views/home.index.html'
		};

		// ----- Register states -----
		$stateProvider
			.state(abstract)
			.state(index)
	}
})();