(function() {
  'use strict';
  
  require('angular');
  require('uirouter');
  require('angular.resource');
  require('angular.translate');
  require('ngStorage');
  require('uiBootstrap');
  require('ngGrid');
  require('ngTouch');
  require('select2');
  require('uiSelect');

  angular.module('views', 
		  ['ui.bootstrap',
		   'ui.router',
		   'pascalprecht.translate',
		   'ngStorage',
		   'ngGrid', 
		   'ngResource',
		   'ui.select2',
		   <% _.each(moduleNames, function(moduleName, index){%>'<%- moduleName %>'<% if(index != moduleNames.length-1){%>,
		   <% }}); %>])
		   
		   .config(function($stateProvider, $locationProvider,$translateProvider) {
			   $translateProvider.preferredLanguage(defaultLocale);
			   $stateProvider
					.state('main.home',{
						url: '/home',
						templateUrl: function(){
							return clientBaseLocation + '/homePage/home.html'
						},
						controller:'homeController'
					});
					
		   })
		   
		   .provider('localization', function LocalizationProvider() {
				return {
					  updateLocale: function() {},
					  $get: function() {
						var updateLocale = this.updateLocale;
						return {
						    setBundles: updateLocale
						};
					  }
				}
			})
			
			.config(['$translateProvider', 'localizationProvider', function($translateProvider, localizationProvider) {
				localizationProvider.updateLocale = function(lang, langData){
					$translateProvider.translations(lang, langData);
				};
			}])
		   
			.config(function($stateProvider, $locationProvider, $translateProvider) {
			    $translateProvider.preferredLanguage(defaultLocale);
				$stateProvider
					.state('main', {
						abstract : true,
						url : '',
						templateUrl : function(){
							return partialsBaseLocation+ '/shared/main.html'
						},
						controller : 'mainController'
					})
			})
		    
		    .config(['$provide', function ($provide) {
				$provide.decorator('$rootScope', ['$delegate', function ($delegate) {
					Object.defineProperty($delegate.constructor.prototype, '$onRootScope', {
						value: function (name, listener) {
							var unsubscribe = $delegate.$on(name, listener);
							this.$on('$destroy', unsubscribe);
						},
						enumerable: false
					});
					return $delegate;
				}]);
			}])	
		
			.constant('$eventsCommon', {
				ngGrid:{
					toggleWidth: 'navGrid.toggle'
				},
				conversations:{<%function createEvents(elements, baseUrl){%>
					<%- baseUrl%>:{<% for(element in elements){%>
							<%- elements[element].name%>:"conversations.<%- elements[element].actions.url.replace('/', '')%>",
						<%}%>
					}
					<%}
				var baseUrl = agents[0].actions.url.replace('/', '').split('.')[0];
				createEvents(agents, baseUrl);%>
				}
			});

})();