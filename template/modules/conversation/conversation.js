'use strict';

module.exports = angular.module('conversation', ['ui.bootstrap', 'ui.router','pascalprecht.translate','LocalStorageModule', 'ngGrid', 'ngResource', 'ui.select2'])
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