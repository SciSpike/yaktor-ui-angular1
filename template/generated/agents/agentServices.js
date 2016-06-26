angular.module('<%=moduleName %>')
  .factory('<%=moduleName %>Services', function($rootScope, SocketService, $eventsCommon){
    
    var _initConversation = function(initData){
      SocketService['init']('<%=actions.url%>',initData).then(function(api){
        api.onAny(function(err,stateName,payload){
          var v = /.*:state:([^:]*):.*/; 
          var nextState = stateName.replace(v, '.$1');
          var currentState = stateName.replace(v, '$1');
          
          var emitData = {
            data: initData,
            event:payload,
            nextState: nextState,
            currentState: currentState
          }
          $rootScope.$emit($eventsCommon.conversations.<%=actions.url.replace('/', '')%>, emitData);
        });
      });
    }
    <%
    for(state in states){
      for(element in states[state].elements){
        var elementName = element.toLowerCase()%>
    var _on_<%=elementName%> = function(initData, data){
      var data = data;
        SocketService.doAction('<%=actions.url%>', '<%=element%>', initData, data, function(err,data){});
    }
      <%}
    }%>
    
    return {
      initConversation: _initConversation,
      <%for(state in states){
        for(element in states[state].elements){
          var elementName = element.toLowerCase()%>
      on_<%=elementName%>: _on_<%=elementName%>,<%}}%>
    }
    
  });