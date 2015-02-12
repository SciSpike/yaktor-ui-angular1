angular.module('<%- moduleName %>')

  .factory('<%- moduleName %>Services', ['$rootScope', '$q', '$timeout', '$eventsCommon', 'RestService', 'SocketService', function($rootScope, $q, $timeout, $eventsCommon, RestService, SocketService){
    <%//used for extracting objects from the spec
    var objectFindByKey = function(array, key, value) {
       for (var i = 0; i < array.length; i++) {
         if (array[i][key] == value) {
           return array[i];
         }
       }
       return null;
     }%>
    //CRUD STUFFS
    <% for(element in actions.elements){
    var elementName = element.toLowerCase();%>
      var _<%- elementName%><%- moduleName %> = function(data, id){
        var data = data;
      var response = $q.defer();
      $timeout(function(){//NEED TO KNOW ID
        <% if(element == 'GET'){%>
        RestService['FINDBYID']('<%- actions.url%>', null,id,function(err,data){
        <%}else if(element == 'DELETE'){%>
        RestService['<%- element%>']('<%- actions.url%>', null,id,function(err,data){
        <%}else{%>
        RestService['<%- element%>']('<%- actions.url%>', data,id,function(err,data){
        <%}%>
                if(err){
                    console.log(err)
                    //$scope.alerts.push(err);
                } else {
                 response.resolve(data);
                 //$scope.data['<%- element%>']=data;
                }
          });
      });
      return response.promise;
      }
      <% }%>

      //AGENT STUFFS
      <% _.each(agents, function(agent, index){
      var newAgent = objectFindByKey(agentSpec, 'id', agent);%>
      var _init<%- newAgent.name%>Conversation = function(initData){
        var initData = initData;
        if(SocketService['init']){
                SocketService['init']('<%- newAgent.actions.url%>',initData, initData, function(err,stateName, data){
                  var currentState = stateName.replace('.state:', '');
                  var emitData = {
                           data: data,
                           currentState: currentState
                       }
                   $rootScope.$emit($eventsCommon.conversations.<%- newAgent.actions.url.replace('/', '')%>, emitData);
                });
            } else {
                SocketService.doAction('<%- newAgent.actions.url%>','init', initData, initData, function(err,data){
                  //WHAT HAPPENS HERE AND DOES THIS EVER GET CALLED?????
                });
            }
      }
      <%_.each(newAgent.states, function(state, index){
        for(element in state.elements){
          var elementName = element.toLowerCase()%>
      var _on_<%- newAgent.name%>_<%- state.name %>_<%- elementName%> = function(initData, data){
        var data = data;
        if(SocketService['<%- element%>']){
          SocketService['<%- element%>']('<%- state.url %>',data, data, function(err,stateName){
             var currentState = stateName.replace('.state:', '');
             var emitData = {
                      data: data,
                      currentState: currentState
                  }
             $rootScope.$emit($eventsCommon.conversations.<%- newAgent.actions.url.replace('/', '')%>, emitData);
          });
        } else {
          SocketService.doAction('<%- newAgent.actions.url%>', '<%- element%>', initData, data, function(err,data){
            //WHAT HAPPENS HERE
          });
        }
      }<%}%>
      <%});%>
      <% }); %>
      return {
        <% for(element in actions.elements){
        var elementName = element.replace('_', '').toLowerCase();%>
        <%- elementName%><%- moduleName %>: _<%- elementName%><%- moduleName %>,<% }%>
          <% _.each(agents, function(agent, index){%>
            <%var newAgent = objectFindByKey(agentSpec, 'id', agent);%>
          init<%- newAgent.name%>Conversation: _init<%- newAgent.name%>Conversation,
          <%_.each(newAgent.states, function(state, index){
            var elements = _.toArray(state.elements);
            _.each(elements, function(element, i){
              var elementName = element.name.toLowerCase()%>
          on_<%- newAgent.name%>_<%- state.name %>_<%- elementName%>: _on_<%- newAgent.name%>_<%- state.name %>_<%- elementName%><% if(i != elements.length-1){%>,<% }%><%});});});%>
      }
  }]);