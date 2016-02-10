//AGENT STUFF

<%//used for extracting objects from the spec
	         var objectFindByKey = function(array, key, value) {
	            for (var i = 0; i < array.length; i++) {
	              if (array[i][key] == value) {
	                return array[i];
	              }
	            }
	            return null;
	          }%>
//array of key agents and their properties
	        $scope.conversationAgents = [<% _.each(agents, function(agent, index){
	          var agentName = agent.split('.').reverse().join("_of_");
	          var newAgent = objectFindByKey(agentSpec, 'id', agent); %>{
	          id:'<%- agent %>',
	          name:'<%- agentName %>',
	          states: [<% _.each(newAgent.states, function(state, index){ %>{
	                    name: '<%- state.name %>',<% var actions = _.toArray(state.elements);%>
	                    actions: [<% _.each(actions, function(action, i){%>'<%- action.name %>'<% if(i != actions.length-1){%>,<%}%><%});%>]
	                  }<% if(index != newAgent.states.length-1){%>,<% }});%>]
	        }<% if(index != agents.length-1){%>,
	       <%}}); %>];
	       
// setup listeners and inits
	       <% _.each(agents, function(agent, index){
	           var agentName = agent.split('.').reverse().join("_of_");
	           var newAgent = objectFindByKey(agentSpec, 'id', agent); %>
	        $scope.$onRootScope($eventsCommon.conversations.<%- newAgent.actions.url.replace('/', '')%>, function(event, data){
	          <% if(state.ui.title.replace('_', '').toLowerCase() == 'find'){%>
	          $scope.<%- newAgent.name%>CurrentStates = ($scope.<%- newAgent.name%>CurrentStates || {});
	          if(data.currentState){
	            $scope.<%- newAgent.name%>CurrentStates[data.data._id] = data.currentState;
	          }
	          <%}else{%>
	          if(data.currentState){
	            $scope.<%- newAgent.name%>CurrentState = data.currentState;
	          }
	          <%}%>
	          $scope.$apply();
	        });
	        
	        $scope.init<%- newAgent.name%>Conversation = function(initData){
	          <%- parentStateName %>Services.init<%- newAgent.name%>Conversation(initData);
	        };
	      <% });%>
//INIT AGENT
	        $scope.initAgents = function(){
	          var data = FormService.returnAnswers($scope.directiveData, answers);
	          data._id = $scope.userId;
	          $scope.initData = FormService.cleanData(data);
	            <% _.each(agents, function(agent, index){
	              var agentName = agent.split('.').reverse().join("_of_");
	              var newAgent = objectFindByKey(agentSpec, 'id', agent);%>
             $scope.init<%- newAgent.name%>Conversation($scope.initData);
	            <%});%>
	        };
          
//Grid actions
          $scope.gridAgentActions = {
            <% _.each(agents, function(agent, index) {
              var agentName = agent.split('.').reverse().join("_of_");
              var newAgent = objectFindByKey(agentSpec, 'id', agent); %>
                get<%-newAgent.name%>ConversationState: function(entity) {
                  // console.log('<%- agent%> Get State For:' + id);
                  var id = $scope.gridOptions.getRowIdentity(entity);
                  var currentState = null;
                  if ($scope. <% -newAgent.name %> CurrentStates) {
                    currentState = $scope. <% -newAgent.name %> CurrentStates[id];
                  }
                  return currentState;
              },
              init<%-newAgent.name%>Conversation: function(entity) {
                // console.log('<%- agent%> INIT DATA:' + initData);
                var id = $scope.gridOptions.getRowIdentity(entity);

                var initData = {
                  _id: id
                }; <%-parentStateName%>Services.init<% -newAgent.name%>Conversation(initData);
              },
              <% _.each(newAgent.states, function(state, index) { %> <%
                var actions = _.toArray(state.elements); %> <% _.each(actions, function(action, i) { %>
                  do<%- agentName %>_<%- state.name %>_<%- action.name.toLowerCase()%> : function(entity) {
                    var id = $scope.gridOptions.getRowIdentity(entity);
                    var initData = {
                      _id: id
                    };
                    $rootScope.setFromCrud(true);
                    $state.go('main.<%- agentName %>.<%- state.name %>.<%- action.name%>', {
                      initData: id
                    });
                  },
                  <%
                }); %> <%
              }); %> <%
            }); %>
          }

//FIND result inits
    //$scope function that findData can call passing in the response.data.results array.
$scope.listInitAgents = function(list){
  if (list && list.length){
    for(i=0; i < list.length; i++){
      var initData = {
          _id: list[i]._id
      };
  <% _.each(agents, function(agent, index){
    var agentName = agent.split('.').reverse().join("_of_");
    var newAgent = objectFindByKey(agentSpec, 'id', agent);%>
      $scope.init<%-newAgent.name%>Conversation(initData);
    <%});%>
    }
  }
};
  
//POSTPUT button actions
  <% _.each(agents, function(agent, index){
  	var agentName = agent.split('.').reverse().join("_of_");
  	var newAgent = objectFindByKey(agentSpec, 'id', agent); %>
  	<% _.each(newAgent.states, function(state, index){ %>
  	<% var actions = _.toArray(state.elements);%>
  	<% _.each(actions, function(action, i){%>
  	$scope.do<%- agentName%>_<%- state.name %>_<%- action.name.toLowerCase()%> = function(e){
  		// for the moment, we keep the modal.
  		// but we'll ultimatley change this to change state
  		$rootScope.setFromCrud(true);
  		$state.go('main.<%- agentName %>.<%- state.name %>.<%- action.name%>', {initData: $stateParams.id});
  	};
  	<%});%>
  	<% });%>
  	<%}); %>
  
          
