<%//used for extracting objects from the spec
var objectFindByKey = function(array, key, value) {
   for (var i = 0; i < array.length; i++) {
     if (array[i][key] == value) {
       return array[i];
     }
   }
   return null;
 }%>
angular.module('<%=moduleName %>')

  .factory('<%=moduleName %>Services', ['$rootScope', '$q', '$filter', '$timeout', '$eventsCommon', 'RestService', 'SocketService', <% _.each(agents, function(agent, index){%>'<%=objectFindByKey(agentSpec, 'id', agent).name%>Services',<% });%> function($rootScope, $q, $filter, $timeout, $eventsCommon, RestService, SocketService<% _.each(agents, function(agent, index){%>
       ,<%=objectFindByKey(agentSpec, 'id', agent).name%>Services<% }); %>){
    //CRUD STUFFS
    <% for(element in actions.elements){
    var elementName = element.toLowerCase();%>
      var _<%=elementName%><%=moduleName %> = function(data, id) {
        <% if (element == 'FIND') {%>
          var data = data || {};
          return $q.when(RestService['FIND']('<%=actions.url%>', data));
        <% } else if (element == 'GET') {%>
          return $q.when(RestService['FINDBYID']('<%=actions.url%>', id));
        <% } else if (element == 'DELETE') {%>
          return $q.when(RestService['<%=element%>']('<%=actions.url%>', null, id));
        <% } else if (element == 'POST') {%>
          var data = data;
          return $q.when(RestService['<%=element%>']('<%=actions.url%>', data));
        <% } else if (element == 'PUT') {%>
          return $q.when(RestService['<%=element%>']('<%=actions.url%>', data, id));
        <% }%>
      }
    <% if (element == 'FIND') {%>
      var _columnDefs = [ <%
          var elems = actions.elements.FIND.components.elements;
          Object.keys(elems).forEach(function(elem, index, test) {
            var element = elems[elem]; %> { <%
              if (element.type == "typeAhead" || element.type == "select") { %> <%
                if (element.ui.hasTitle) { %>
              field: '<%=elem%>.title',
                <%
                } else { %>
              field: '<%=elem%>',
                <%
                } %> <%
              } else if (element.type.toLowerCase() == "date"){ %>
              field: '<%=elem%>',type: Date, cellFilter: "date : 'MMM d, y'",
              <%
              } else { %>
              field: '<%=elem%>', <% } %>minWidth: 150, enableColumnResizing: true, enableHiding: false, enableSorting: true, displayName: $filter('translate')('<%-element.ui.title%>')
            }, <%
          }); %> <%
          if (agents.length > 0 ) {
             %> <% _.each(agents, function(agent, index) {
                var agentName = agent.split('.').reverse().join("_of_");
                var newAgent = objectFindByKey(agentSpec, 'id', agent); %> {
                  cellTemplate: "<div>{{grid.appScope.gridOptions.actions.get<%=newAgent.name%>ConversationState(row.entity);}}</div>",
                    minWidth: 150, enableColumnResizing: true, enableHiding: false, enableSorting: false, displayName: $filter('translate')('STATE'), name: 'agent-state'
                }, {
                  cellTemplate: "<div>" + "<button class='btn btn-default btn-sm text-capitalize' ng-if='grid.appScope.gridOptions.actions.get<%=newAgent.name%>ConversationState(row.entity)==null' ng-click='grid.appScope.gridOptions.actions.init<%=newAgent.name%>Conversation(row.entity);' >{{'INIT'|translate}}</button>" + <% _.each(newAgent.states, function(state, index) { %> <%
                    var actions = _.toArray(state.elements); %> <% _.each(actions, function(action, i) { %>
                      "<button class='btn btn-default btn-sm text-capitalize' ng-if='grid.appScope.gridOptions.actions.get<%=newAgent.name%>ConversationState(row.entity)==\"<%-state.name%>\"' ng-click='grid.appScope.gridOptions.actions.do<%=agentName%>_<%=state.name %>_<%=action.name.toLowerCase()%>(row.entity);' ><%=action.name%></button>" + <%}); %> <%
                  }); %>
                  "</div>",
                    minWidth: 150, enableColumnResizing: true, enableHiding: false, enableSorting: false, displayName: $filter('translate')('ACTIONS'), name: 'agent-actions'
                }, <%
              }); %> <%
          } %> { <%
            var putState = 'main.' + moduleName + '.PUT'; %>
            cellTemplate: "<div class='editCell '><a ng-click='grid.appScope.gridOptions.actions.changeState(\"<%=putState%>\", row.entity)'>{{'EDIT'|translate}}</a></div>",
              width: '75', minWidth: 75, enableColumnResizing: true, enableHiding: false, enableSorting: false, displayName: $filter('translate')('EDIT'), name: 'edit'
          }, { <%
            var deleteState = 'main.' + moduleName + '.DELETE'; %>
            cellTemplate: "<div class='editCell'><button class='btn btn-default btn-sm' ng-click='confirmDelete = !confirmDelete' ng-show='!confirmDelete'>{{'DELETE'|translate}}</button><button class='btn btn-default btn-sm' ng-click='confirmDelete = !confirmDelete' ng-show='confirmDelete'>{{'CANCEL.DELETE'|translate}}</button>&nbsp;<button class='btn btn-default btn-sm' ng-click='grid.appScope.gridOptions.actions.deleteItem(row.entity)' ng-show='confirmDelete'>{{'CONFIRM.DELETE'|translate}}</button></div>",
              width: '150', minWidth: 150, enableColumnResizing: false, enableHiding: false, enableSorting: false, displayName: $filter('translate')('DELETE'), name: 'delete'
          }
        ];
      var _gridHeaders = <%= JSON.stringify(actions.elements.FIND.components.elements) %> ;
      <% }}%>
      return {
        <% for(element in actions.elements){
        if (element == 'FIND') {%>
        columnDefs: _columnDefs,
        gridHeaders: _gridHeaders,<% }
    var elementName = element.replace('_', '').toLowerCase();%>
        <%=elementName%><%=moduleName %>: _<%=elementName%><%=moduleName %>,<% }%>
          <% _.each(agents, function(agent, index){%>
            <%var newAgent = objectFindByKey(agentSpec, 'id', agent);%>
          init<%=newAgent.name%>Conversation: <%=newAgent.name%>Services.initConversation,
          <%_.each(newAgent.states, function(state, index){
            var elements = _.toArray(state.elements);
            _.each(elements, function(element, i){
              var elementName = element.name.toLowerCase();%>
          on_<%=newAgent.name%>_<%=state.name %>_<%=elementName%>: <%=newAgent.name%>Services.on_<%=elementName%>,<%});});});%>
      }
  }]);