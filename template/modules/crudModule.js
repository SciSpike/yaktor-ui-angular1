angular.module('<%- moduleName %>', 
		  ['ui.bootstrap',
		   'ui.router',
		   'pascalprecht.translate',
		   'ngStorage',
		   'ngGrid', 
		   'ngResource',
		   'ui.select2'])
		   
		   .config(function($stateProvider, $locationProvider,$translateProvider) {
			   $translateProvider.preferredLanguage(defaultLocale);
			   $stateProvider
				   .state('main.<%- moduleName %>',{
						abstract: true,
						templateUrl: function(){
							return partialsBaseLocation + '/<%- moduleName %>/index.html'
						},
						controller:'<%- moduleName %>Controller' //HANDLES CONNECTION AND STATE TRANSTITIONS (WITH ABILITY TO CUSTOMIZE ???)
					})
					<% _.each(states, function(state, key){
						var stateName = key;
					%>
					.state('main.<%- moduleName %>.<%- stateName %>',{
						params:['initData'],
						templateUrl: function(){
							return partialsBaseLocation + '/<%- moduleName %>/<%- stateName %>.html'
						},
						controller:'<%- moduleName %><%- stateName %>Controller'
					})
					<% _.each(state.elements, function(view, key){
					var viewName = view.subPath.replace('/', '');%>
					.state('main.<%- moduleName %>.<%- stateName %>.<%- viewName%>',{
						templateUrl: function(){
							return partialsBaseLocation + '/<%- moduleName %>/<%- stateName %>/<%- viewName %>.html'
						},
						controller:'<%- moduleName %><%- viewName %>Controller'
					})<% });%><% });%>
		  });