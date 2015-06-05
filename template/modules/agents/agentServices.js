angular.module('<%- moduleName %>')
  .factory('<%- moduleName %>Services', ['$rootScope', '$q', '$timeout', 'RestService', 'SocketService', '$eventsCommon', function($rootScope, $q, $timeout, RestService, SocketService, $eventsCommon){
    
    var _initConversation = function(initData){
      var initData = initData;
      if(SocketService['init']){
              SocketService['init']('<%- actions.url%>',initData, initData, function(err,stateName){
                var nextState = stateName.replace('state:', '');
                var currentState = stateName.replace('.state:', '');

                var emitData = {
                  data: initData,
                  nextState: nextState,
                  currentState: currentState
                }
                $rootScope.$emit($eventsCommon.conversations.<%- actions.url.replace('/', '')%>, emitData);
              });
          } else {
              SocketService.doAction('<%- actions.url%>','init', initData, initData, function(err,data){});
          }
    }
    <%
    for(state in states){
      for(element in states[state].elements){
        var elementName = element.toLowerCase()%>
    var _on_<%- elementName%> = function(initData, data){
      var data = data;
        SocketService.doAction('<%- actions.url%>', '<%- element%>', initData, data, function(err,data){});
    }
      <%}
    }%>
    
    return {
      initConversation: _initConversation,
      <%for(state in states){
        for(element in states[state].elements){
          var elementName = element.toLowerCase()%>
      on_<%- elementName%>: _on_<%- elementName%>,<%}}%>
    }
    
  }]);