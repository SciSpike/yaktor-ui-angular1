angular.module('<%- moduleName %>', 
		  ['ui.bootstrap',
		   'ui.router',
		   'pascalprecht.translate',
		   'ngStorage',
		   'ngGrid', 
		   'ngResource',
		   'ui.select2')
		   
		   .config(function($stateProvider, $locationProvider,$translateProvider) {
			   $translateProvider.preferredLanguage(defaultLocale);
			   $stateProvider
				   .state('main.<%- moduleName %>',{
						abstract:true,
						url:'/<%- moduleName %>',
						templateUrl: function(){
							return globalVarsProvider.partials.html + '/<%- moduleName %>/index.html'
						},
						controller:'<%- moduleName %>Controller'
					}),
					<% _.each(states, function(state, index){%>
						.state('main.<%- moduleName %>.<%- state.name %>',{
							url:'/<%- state.name %>',
							templateUrl: function(){
								return globalVarsProvider.partials.html + '/<%- moduleName %>/<%- state.name %>.html'
							},
							conntroller:'<%- moduleName %><%- state.name %>Controller'
						});
					<% });%>
		   });