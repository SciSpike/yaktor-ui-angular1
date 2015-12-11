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

  angular.module('views',
    ['ui.bootstrap',
      'ui.router',
      'pascalprecht.translate',
      'ngStorage',
      'ngGrid',
      'ngResource',
      'ui.grid',
      'ui.grid.autoResize',
      'ui.grid.cellNav',
      'ui.grid.edit',
      'ui.grid.expandable',
      'ui.grid.exporter',
      'ui.grid.i18n',
      'ui.grid.importer',
      'ui.grid.infiniteScroll',
      'ui.grid.pinning',
      'ui.grid.resizeColumns',
      'ui.grid.selection',
      'ui.grid.treeBase',
      'ui.grid.treeView',
      'ui.select',
      'checklist-model',
      'sharedModule',
      'utilities',
      'ngSanitize',
      'textAngular',
    <% _.each(moduleNames, function(moduleName, index){%>'<%- moduleName %>'<% if(index != moduleNames.length-1){%>,
    <% }}); %>]);


})();