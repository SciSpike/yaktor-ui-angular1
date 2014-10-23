(function() {
  'use strict';
  
  require('angular');
  require('uirouter');
  require('angular.resource');
  require('angular.translate');
  require('ngStorage');
  require('uiBootstrap');
  require('ngGrid');
  require('ngTouch');
  require('select2');
  require('uiSelect');

  angular.module('views', 
		  ['ui.bootstrap',
		   'ui.router',
		   'pascalprecht.translate',
		   'ngStorage',
		   'ngGrid', 
		   'ngResource',
		   'ui.select2',
		   'checklist-model',
		   'sharedModule',
		   <% _.each(moduleNames, function(moduleName, index){%>'<%- moduleName %>'<% if(index != moduleNames.length-1){%>,
		   <% }}); %>]);

})();