(function() {
  'use strict';
  
  require('angular');
  require('uirouter');
  require('angular.resource');
  require('angular.translate');
  require('ngStorage');
  require('uiBootstrap');
  require('ngTable');
  require('ngTouch');
  require('select2');
  require('uiSelect');
  require('conversation');
  
  angular.module('views', 
		  ['ui.bootstrap',
		   'ui.router',
		   'pascalprecht.translate',
		   'ngStorage',
		   'ngTable',
		   'ngResource',
		   'ui.select2',
		   'hmTouchEvents',
		   'ngRepeatReorder',
		   'conversation'])
    .config(function($stateProvider, $locationProvider,$translateProvider) {
      $translateProvider.preferredLanguage(defaultLocale);
      
      $translateProvider.preferredLanguage(defaultLocale);

		$stateProvider
				.state('main', {
					abstract : true,
					url : '',
					templateUrl : '/main.html',
					controller : 'mainController'
				})
				.controller('mainController',
						function($scope) {
							
						});
    });

})();