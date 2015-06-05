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
	        function initAgents(){
	          var data = FormService.returnAnswers($scope.directiveData, answers);
	          data._id = $scope.userId;
	          $scope.initData = FormService.cleanData(data);
	            <% _.each(agents, function(agent, index){
	              var agentName = agent.split('.').reverse().join("_of_");
	              var newAgent = objectFindByKey(agentSpec, 'id', agent);%>
             $scope.init<%- newAgent.name%>Conversation($scope.initData);
	            <%});%>
	        };
