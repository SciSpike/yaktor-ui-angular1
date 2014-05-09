(function() {
  'use strict';
  
  require('angular');
  require('uirouter');
  require('angular.resource');
  require('angular.translate');
  require('localStorageService');
  require('uiBootstrap');
  require('ngGrid');
  require('ngTouch');
  require('select2');
  require('uiSelect');
  require('conversation');
  
  angular.module('views', 
		  ['ui.bootstrap',
		   'ui.router',
		   'pascalprecht.translate',
		   'LocalStorageModule',
		   'ngGrid',
		   'ngResource',
		   'ui.select2',
		   'hmTouchEvents',
		   'ngRepeatReorder',
		   'conversation'])
    .config(function($stateProvider, $locationProvider,$translateProvider) {
      $translateProvider.preferredLanguage(defaultLocale);
    });

})();