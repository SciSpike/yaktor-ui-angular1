angular.module('<%- moduleName %>', 
      ['ui.bootstrap',
      'ui.router',
      'pascalprecht.translate',
      'ngStorage',
      'ngGrid', 
      'ngResource',
      'ui.select',
      'checklist-model',
      'sharedModule',
      'ngSanitize'])
       
       .config(function($stateProvider, $locationProvider,$translateProvider,routesExtendedProvider) {
         $translateProvider.preferredLanguage(defaultLocale);
         $stateProvider
           .state('main.<%- moduleName %>',{
            url:'/<%- moduleName %>/:initData',
            templateUrl: function(){
              return partialsBaseLocation + '/agents/<%- moduleName %>/index.html'
            },
            controller: routesExtendedProvider.routes.<%- moduleName %> || '<%- moduleName %>Controller' //HANDLES CONNECTION AND STATE TRANSTITIONS (WITH ABILITY TO CUSTOMIZE ???)
          })
          
          .state('main.<%- moduleName %>.init',{ // TRANSITIONED TO IF NO INIT DATA IN PARENT
            templateUrl: function(){
              return partialsBaseLocation + '/agents/<%- moduleName %>/init.html'
            },
            controller: routesExtendedProvider.routes.<%- moduleName %>Init || '<%- moduleName %>initController'
          })
          <% _.each(states, function(state, key){
            var stateName = state.name;
          %>
          .state('main.<%- moduleName %>.<%- stateName %>',{
            params:['initData','fromCrud'],
            templateUrl: function(){
              return partialsBaseLocation + '/agents/<%- moduleName %>/<%- stateName %>.html'
            },
            controller: routesExtendedProvider.routes['<%- moduleName %>.<%- stateName %>'] || '<%- moduleName %><%- stateName %>Controller'
          })
          <% _.each(state.elements, function(view, key){
          var viewName = view.subPath.replace('/', '');%>
          .state('main.<%- moduleName %>.<%- stateName %>.<%- viewName%>',{
            templateUrl: function(){
              return partialsBaseLocation + '/agents/<%- moduleName %>/<%- stateName %>/<%- viewName %>.html'
            },
            controller: routesExtendedProvider.routes['<%- moduleName %>.<%- viewName %>'] || '<%- moduleName %><%- viewName %>Controller'
          })<% });%><% });%>
      });