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
					<% _.each(states, function(state, index){
						var stateName = state.name;
					%>
						.state('main.<%- moduleName %>.<%- stateName %>',{
							url:'/<%- stateName %>',
							templateUrl: function(){
								return globalVarsProvider.partials.html + '/<%- moduleName %>/<%- stateName %>.html'
							},
							conntroller:'<%- moduleName %><%- stateName %>Controller'
						});
					<% _.each(state.elements, function(actionState, index){
						var actionstateName = actionState.subPath.replace('/', '');
					%>
						.state('main.<%- moduleName %>.<%- stateName %>.<%- actionstateName %>',{
							url:'/<%- actionstateName %>',
							templateUrl: function(){
								return globalVarsProvider.partials.html + '/<%- moduleName %>/<%- stateName %>/<%- actionstateName %>.html'
							},
							conntroller:'<%- moduleName %><%- stateName %><%- actionstateName %>Controller'
						});
					<% });%>
				<% });%>
		   });