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
					   	url:'/<%- moduleName %>',
						templateUrl: function(){
							return partialsBaseLocation + '/crud/<%- moduleName %>/index.html'
						},
						controller:'<%- moduleName %>Controller'
					})
					<% _.each(states, function(state, key){
						var stateName = key;
					%>
					.state('main.<%- moduleName %>.<%- stateName %>',{
						url:'/<%- stateName %>/:id',
						templateUrl: function(){
							return partialsBaseLocation + '/crud/<%- moduleName %>/<%- stateName %>.html'
						},
						controller:'<%- moduleName %><%- stateName %>Controller'
					})
					<% _.each(state.elements, function(view, key){
					var viewName = view.subPath.replace('/', '');%>
					.state('main.<%- moduleName %>.<%- stateName %>.<%- viewName%>',{
						templateUrl: function(){
							return partialsBaseLocation + '/crud/<%- moduleName %>/<%- stateName %>/<%- viewName %>.html'
						},
						controller:'<%- moduleName %><%- viewName %>Controller'
					})<% });%><% });%>
		  });