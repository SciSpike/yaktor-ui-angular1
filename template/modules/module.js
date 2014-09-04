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
						url:'/<%- moduleName %>',
						templateUrl: function(){
							return globalVarsProvider.partials.html + '/<%- moduleName %>/index.html'
						},
						controller:'<%- moduleName %>Controller' //HANDLES CONNECTION AND STATE TRANSTITIONS (WITH ABILITY TO CUSTOMIZE ???)
					}),
					
					.state('main.<%- moduleName %>.init',{ // TRANSITIONED TO IF NO INIT DATA IN PARENT
						templateUrl: function(){
							return globalVarsProvider.partials.html + '/<%- moduleName %>/init.html'
						},
						controller:'<%- moduleName %>initController'
					}),
					<% _.each(states, function(state, index){
						var stateName = state.name;
					%>
						.state('main.<%- moduleName %>.<%- stateName %>',{
							templateUrl: function(){
								return globalVarsProvider.partials.html + '/<%- moduleName %>/<%- stateName %>.html'
							},
							controller:'<%- moduleName %><%- stateName %>Controller',
							views:{
								<% _.each(state.elements, function(view, index){
									var viewName = view.subPath.replace('/', '');
								%>
								'<%- viewName %>':{
									templateUrl: function(){
										return globalVarsProvider.partials.html + '/<%- moduleName %>/<%- stateName %>/<%- viewName %>.html'
									},
									controller:'<%- moduleName %><%- stateName %><%- viewName %>Controller'
								}
								<% });%>
							}
						});
				<% });%>
		   });