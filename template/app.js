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
  require('uiSelect');
  require('ngSanitize');

  angular.module('views', 
      ['ui.bootstrap',
      'ui.router',
      'pascalprecht.translate',
      'ngStorage',
      'ngGrid', 
      'ngResource',
      'ui.select',
      'checklist-model',
      'sharedModule',
      'ngSanitize',
       <% _.each(moduleNames, function(moduleName, index){%>'<%- moduleName %>'<% if(index != moduleNames.length-1){%>,
         <% }}); %>]);


})();