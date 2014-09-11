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
					//console.log(langData);
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
					<%- baseUrl%>:{<% for(element in elements){console.log(elements[element]);%>
							<%- elements[element].name%>:"conversations.elements[element].actions.url.replace('/', '')",
								/*{<% for(state in elements[element].states){
								var keyLength = _.keys(elements[element].states[state].elements).length;
								if(keyLength > 0){%>
								<%- elements[element].states[state].name%>:{<% for(action in elements[element].states[state].elements){%>
									<%- action%>: 'conversations.<%- elements[element].states[state].url.replace('/', '')%>.<%- action%>',<%}%>
								},<%}else{%>
								<%- elements[element].states[state].name%>: "conversations.<%- elements[element].states[state].url.replace('/', '')%>",<%}%><%}%>*/
							},
						<%}%>
					}
					<%}
				var baseUrl = agents[0].actions.url.replace('/', '').split('.')[0];
				createEvents(agents, baseUrl);%>
				}
			});

})();