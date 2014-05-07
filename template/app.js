(function() {
  'use strict';
  
  require('uirouter');
  require('angular.resource');
  require('angular.translate');
  require('localStorageService');
  require('uiBootstrap');
  require('ngGrid');
  require('ngTouch');
  require('select2');
  require('uiSelect');
  //require('hammer');
  //require('angularHammer');
  //require('ngRepeatReorder');
  
  angular.module('<%=appname%>', ['ui.bootstrap', 'ui.router','pascalprecht.translate','LocalStorageModule', 'ngGrid', 'ngResource', 'ui.select2', 'hmTouchEvents', 'ngRepeatReorder'])
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