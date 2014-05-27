(function() {
  'use strict';
  
  require('angular');
  require('uirouter');
  require('angular.resource');
  require('angular.translate');
  require('ngStorage');
  require('uiBootstrap');
  require('ngTable');
  require('ngGrid');
  require('ngTouch');
  require('select2');
  require('uiSelect');
  
  angular.module('views', 
		  ['ui.bootstrap',
		   'ui.router',
		   'pascalprecht.translate',
		   'ngStorage',
		   'ngTable',
		   'ngGrid', 
		   'ngResource',
		   'ui.select2',
		   'conversation'])
    .config(function($stateProvider, $locationProvider,$translateProvider) {
    	
      $translateProvider.preferredLanguage(defaultLocale);

		$stateProvider
				.state('main', {
					abstract : true,
					url : '',
					templateUrl : '/main.ejs',
					controller : 'mainController'
				})
    })
    .controller('mainController',
		function($scope) {
							
		}
    );

})();