
<%
var directiveData = {};
var createDirectives = function(dataObject, elements){
	for(element in elements){
		if(elements[element].type == 'array'){
			if(elements[element].components){
				for(el in elements[element].components.elements){
					elements[element].components.elements[el].answer = '';
				}
				dataObject[element] = [elements[element].components.elements];
			}else{
				dataObject[element] = elements[element];
				dataObject[element].answer = new Array(1);
			}
		}else{
			if(!elements[element].components){
				dataObject[element] = elements[element];
				dataObject[element].answer = '';
			}else{
				dataObject[element] = {};
				createDirectives(dataObject[element], elements[element].components.elements);
			}
		}
	}
}
createDirectives(directiveData, state.components.elements);
%>

$scope.directiveData = <%= JSON.stringify(directiveData,null,2)%>;

<% if(state.ui.title.replace('_', '').toLowerCase() == 'put'){%>
<%- parentStateName %>Services.get<%- parentStateName%>({}, id).then(function(response) {
	FormService.mergeAnswers($scope.directiveData, response);
	console.log('done');
	<%if(state.ui.title.replace('_', '').toLowerCase() == 'get' || state.ui.title.replace('_', '').toLowerCase() == 'put'){%>
	<% if (agents.length> 0){%>setTimeout(initAgents,500);<%}%><%}%>
});
<%}%>
var answers = {};
$scope.cancelForm = function(){
	$scope.changeState('main.<%- parentStateName %>.FIND', {id: 1}, null);
}
$scope.submitForm = function(type){
	var data = FormService.returnAnswers($scope.directiveData, answers);
	data = FormService.cleanData(data);
	<%- parentStateName %>Services.<%- state.ui.title.toLowerCase().replace('_', '')%><%- parentStateName%>(data, id).then(function(response) {
		$scope.changeState('main.<%- parentStateName %>.FIND', {id: 1}, response);
	});
};
<% if (agents.length>0){%>
//AGENT BUTTONS ACTIONS
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
<%}%>