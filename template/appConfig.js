angular.module('views')
.config(function($stateProvider, $locationProvider, $translateProvider, routesExtendedProvider) {
  $translateProvider.preferredLanguage(defaultLocale);
  $stateProvider
    .state('main', {
      abstract : true,
      url : '',
      templateUrl : function(){
        return partialsBaseLocation+ '/shared/main.html'
      },
      controller : routesExtendedProvider.routes.main || 'mainController'
    })
   .state('main.home',{
     url: '/home',
     templateUrl: function(){
       return clientBaseLocation + '/custom/homePage/home.html'
     },
     controller: routesExtendedProvider.routes.home || 'homeController'
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
});