angular.module('<%- moduleName %>', 
		  ['ui.bootstrap',
		   'ui.router',
		   'pascalprecht.translate',
		   'ngStorage',
		   'ngGrid', 
		   'ngResource',
		   'ui.select2',
		   'checklist-model',
		   'sharedModule'])
		   
		   .config(function($stateProvider, $locationProvider,$translateProvider,routesExtendedProvider) {
			   $translateProvider.preferredLanguage(defaultLocale);
			   $stateProvider
				   .state('main.<%- moduleName %>',{
					   	url:'/<%- moduleName.replace("_s_","/").replace("_d_",".") %>',
						templateUrl: function(){
							return partialsBaseLocation + '/crud/<%- moduleName %>/index.html'
						},
						controller: routesExtendedProvider.routes.<%- moduleName %> || '<%- moduleName %>Controller'
					})
					<% _.each(states, function(state, key){
						var stateName = key;
					%>
					.state('main.<%- moduleName %>.<%- stateName %>',{
						<% if(stateName == 'FIND' || stateName == 'POST'){ %>url:'/<%- stateName %>',<%}else{%>url:'/<%- stateName %>/:id',<%}%>
						templateUrl: function(){
							return partialsBaseLocation + '/crud/<%- moduleName %>/<%- stateName %>.html'
						},
						controller: '<%- moduleName %><%- stateName %>Controller'
					})
					<% _.each(state.elements, function(view, key){
					var viewName = view.subPath.replace('/', '');%>
					.state('main.<%- moduleName %>.<%- stateName %>.<%- viewName%>',{
						templateUrl: function(){
							return partialsBaseLocation + '/crud/<%- moduleName %>/<%- stateName %>/<%- viewName %>.html'
						},
						controller: '<%- moduleName %><%- viewName %>Controller'
					})<% });%><% });%>
		  });