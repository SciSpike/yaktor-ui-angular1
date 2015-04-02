angular.module('<%- moduleName %>')
  .factory('<%- moduleName %>Services', ['$rootScope', '$q', '$timeout', 'RestService', 'SocketService', '$eventsCommon', function($rootScope, $q, $timeout, RestService, SocketService, $eventsCommon){
    
    var _initConversation = function(initData){
      var initData = initData;
      if(SocketService['init']){
              SocketService['init']('<%- actions.url%>',initData, initData, function(err,stateName){
                var nextState = stateName.replace('state:', '');
                var emitData = {
                  data: initData,
                  nextState: nextState
                }
                $rootScope.$emit($eventsCommon.conversations.<%- actions.url.replace('/', '')%>, emitData);
              });
          } else {
              SocketService.doAction('<%- actions.url%>','init', initData, initData, function(err,data){
                //WHAT HAPPENS HERE AND DOES THIS EVER GET CALLED?????
              });
          }
    }
    
    <%
    for(state in states){
      for(element in states[state].elements){
        var elementName = element.toLowerCase()%>
    var _on_<%- elementName%> = function(initData, data){
      var data = data;
      if(SocketService['<%- element%>']){
        SocketService['<%- element%>']('<%- states[state].url%>',data, data, function(err,stateName){
           var nextState = stateName.replace('state:', '');
           var emitData = {
                    data: data,
                    nextState: nextState
                }
           $rootScope.$emit($eventsCommon.conversations.<%- actions.url.replace('/', '')%>, emitData);
               //$rootScope.$emit($eventsCommon.conversations.<%- states[state].url.replace('/', '')%>.<%- element%>, emitData);
        });
      } else {
        SocketService.doAction('<%- actions.url%>', '<%- element%>', initData, data, function(err,data){
          //WHAT HAPPENS HERE
        });
      }
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