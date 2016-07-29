angular.module('<%=moduleName %>',
  ['ui.bootstrap',
    'ui.router',
    'pascalprecht.translate',
    'ngStorage',
    'ngResource',
    'ui.select',
    'checklist-model',
    'clientConfig',
    'ngSanitize'
  ])

  .config(function($stateProvider, $locationProvider,$translateProvider,routesExtendedProvider, htmlExtendedProvider, clientConstants) {
    $translateProvider.preferredLanguage(clientConstants.defaultLocale);
    $stateProvider
      .state('main.<%=moduleName %>',{
        url:'/<%=moduleName.replace("_s_","/").replace("_d_",".") %>',
        templateUrl: function(){
          if(htmlExtendedProvider.views['<%=moduleName %>.index']){
            return htmlExtendedProvider.views['<%=moduleName %>.index'];
          }
          return clientConstants.partialsBaseLocation + '/crud/<%=moduleName %>/index.html'
        },
        controller: routesExtendedProvider.routes.<%=moduleName %> || '<%=moduleName %>Controller'
      })
    <% _.each(states, function(state, key){
      var stateName = key;
      %>
      .state('main.<%=moduleName %>.<%=stateName %>',{
        <% if(stateName == 'FIND' || stateName == 'POST'){ %>url:'/<%=stateName %>?view&userDetails',<%}else{%>url:'/<%=stateName %>/:id',<%}%>
      templateUrl: function(){
        if(htmlExtendedProvider.views['<%=moduleName %>.<%=stateName %>']){
          return htmlExtendedProvider.views['<%=moduleName %>.<%=stateName %>'];
        }
        return clientConstants.partialsBaseLocation + '/crud/<%=moduleName %>/<%=stateName %>.html'
      },
      controller: routesExtendedProvider.routes['<%=moduleName %>.<%=stateName %>'] || '<%=moduleName %><%=stateName %>Controller'
    })
    <% _.each(state.elements, function(view, key){
      var viewName = view.subPath.replace('/', '');%>
      .state('main.<%=moduleName %>.<%=stateName %>.<%=viewName%>',{
        templateUrl: function(){
          if(htmlExtendedProvider.views['<%=moduleName %>.<%=stateName %>.<%=viewName %>']){
            return htmlExtendedProvider.views['<%=moduleName %>.<%=stateName %>.<%=viewName %>'];
          }
          return clientConstants.partialsBaseLocation + '/crud/<%=moduleName %>/<%=stateName %>/<%=viewName %>.html'
        },
        controller: routesExtendedProvider.routes['<%=moduleName %>.<%=viewName %>'] || '<%=moduleName %><%=viewName %>Controller'
      })<% });%><% });%>
});