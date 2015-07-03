angular.module('views')
.config(function($stateProvider, $locationProvider, $translateProvider, $urlRouterProvider, routesExtendedProvider, htmlExtendedProvider) {
  $translateProvider.preferredLanguage(defaultLocale);
  $translateProvider.useSanitizeValueStrategy('sanitize');
  $urlRouterProvider.when('', '/home');
  
  $stateProvider
    .state('main', {
      abstract : true,
      templateUrl : function(){
        if(htmlExtendedProvider.views['main.index']){
          return htmlExtendedProvider.views['main.index'];
        }
        return partialsBaseLocation + '/shared/main.html';
      },
      controller : routesExtendedProvider.routes['main.index'] || 'mainController'
    })
   .state('main.home',{
     url: '/home',
     templateUrl: function(){
       return clientBaseLocation + '/custom/homePage/home.html';
     },
     controller: routesExtendedProvider.routes['home.index'] || 'homeController'
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

.config(['$provide',
  function($provide) {
    $provide.decorator('$rootScope', function($delegate) {
      $delegate._fromCrud = false;
      $delegate._returnToCrud;
      $delegate._returnToParams;
      
      $delegate.getFromCrud = function(){
        return $delegate._fromCrud;
      };
      $delegate.setFromCrud = function(val){
        $delegate._fromCrud = val;
      };
      
      $delegate.getReturnToCrud = function(){
        return $delegate._returnToCrud;
      };
      $delegate.setReturnToCrud = function(val){
        $delegate._returnToCrud = val;
      };

      $delegate.getReturnToParams = function(){
        return $delegate._returnToParams;
      };
      $delegate.setReturnToParams = function(val){
        $delegate._returnToParams = val;
      };
      
      return $delegate;
    });
  }
])

.constant('$eventsCommon', {
 ngGrid:{
   toggleWidth: 'navGrid.toggle'
 },
 conversations:{<%function createEvents(agents){
   for(agent in agents){
     var elements = agents[agent].elements;
   %>
   <%- agents[agent].name%>:{<% for(element in elements){%>
       <%- _.last(elements[element].actions.url.replace('/', '').split('.'))%>: "conversations.<%- elements[element].actions.url.replace('/', '')%>",
     <%}%>
   },
   <%}}
 var agentNames = [],
   agentObject = {};
 for(agent in agents){
   var agentName = agents[agent].actions.url.replace('/', '').split('.')[0];
   if(agentNames.indexOf(agentName) == -1){
     agentObject[agentName] = {
       name: agentName,
       elements: [agents[agent]]
     }
     agentNames.push(agentName);
   }else{
     agentObject[agentName].elements.push(agents[agent]);
   }
 }
 createEvents(agentObject);%>
 }
})

 .config(['defaultSettingsProvider', 'clientConstants', function (defaultSettingsProvider, clientConstants) {
   defaultSettingsProvider.setElementTypes(clientConstants.forms.elementTypes);
}]);