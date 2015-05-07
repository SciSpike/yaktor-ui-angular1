<%//used for extracting objects from the spec
var objectFindByKey = function(array, key, value) {
   for (var i = 0; i < array.length; i++) {
     if (array[i][key] == value) {
       return array[i];
     }
   }
   return null;
 }%>
angular.module('<%- moduleName %>')

  .factory('<%- moduleName %>Services', [
    '$rootScope', 
    '$q', 
    '$timeout', 
    '$eventsCommon', 
    'RestService', 
    'SocketService',<% _.each(agents, function(agent, index){%>
    '<%=objectFindByKey(agentSpec, 'id', agent).name%>Services',<% }); %>
     function($rootScope, $q, $timeout, $eventsCommon, RestService, SocketService<% _.each(agents, function(agent, index){%>
       ,<%=objectFindByKey(agentSpec, 'id', agent).name%>Services<% }); %>){
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

      return {
        <% for(element in actions.elements){
        var elementName = element.replace('_', '').toLowerCase();%>
        <%- elementName%><%- moduleName %>: _<%- elementName%><%- moduleName %>,<% }%>
          <% _.each(agents, function(agent, index){%>
            <%var newAgent = objectFindByKey(agentSpec, 'id', agent);%>
          init<%- newAgent.name%>Conversation: <%= newAgent.name%>Services.initConversation,
          <%_.each(newAgent.states, function(state, index){
            var elements = _.toArray(state.elements);
            _.each(elements, function(element, i){
              var elementName = element.name.toLowerCase();%>
          on_<%- newAgent.name%>_<%- state.name %>_<%- elementName%>: <%= newAgent.name%>Services._on_<%- elementName%>,<%});});});%>
      }
  }]);