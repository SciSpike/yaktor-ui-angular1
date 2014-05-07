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
  require('ngRepeatReorder');
  
  angular.module('<%=appname%>', ['ui.bootstrap', 'ui.router','pascalprecht.translate','LocalStorageModule', 'ngGrid', 'ngResource', 'ui.select2', 'ngRepeatReorder'])
    .config(function($stateProvider, $locationProvider,$translateProvider) {
      $translateProvider.preferredLanguage(defaultLocale);
      $stateProvider
        
        <% Object.keys(states).forEach(function(stateName){ 
           var s = states[stateName]; 
           var controller = s.friendly;%>
        <%
          if(s.proto.match(/ws:/)){
            %><% include app/ws.js %><%
          } else {
            %><% include app/http.js %><%
          }
        %>
        <% });%>
        
      
    });

})();