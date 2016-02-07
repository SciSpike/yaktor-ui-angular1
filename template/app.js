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
  require('uiGrid');
  require('uiSelect');
  require('ngSanitize');
  require('vcRecaptcha');
  require('rangy');
  require('textAngular');
  require("ngAnimate");
  
  angular.module('views',
    ['ui.bootstrap',
      'ui.router',
      'pascalprecht.translate',
      'ngStorage',
      'ngGrid',
      'ngResource',
      'ui.grid',
      'ui.grid.resizeColumns',
      'ui.grid.infiniteScroll',
      'ui.grid.expandable',
      'ui.grid.exporter',
      'ui.grid.selection', 
      'ui.grid.pinning',
      'ui.select',
      'checklist-model',
      'clientConfig',
      'utilities',
      'ngSanitize',
      'textAngular',
      'ngAnimate',
      <% _.each(moduleNames, function(moduleName, index){%>'<%- moduleName %>'<% if(index != moduleNames.length-1){%>,
      <% }}); %>]);


})();