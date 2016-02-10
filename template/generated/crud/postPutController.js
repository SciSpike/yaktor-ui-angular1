<% if (agents.length){%>
  angular.extend(this, $controller('<%- parentStateName%>AgentController', {$scope: $scope}));
<%}%>
  
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
	FormService.mergeAnswers($scope.directiveData, response.data);
	console.log('done');
	<%if(state.ui.title.replace('_', '').toLowerCase() == 'get' || state.ui.title.replace('_', '').toLowerCase() == 'put'){%>
    var data = FormService.returnAnswers($scope.directiveData, answers);
    
  <% if (agents.length> 0){%>setTimeout(function(){
    $scope.initAgents(data);
  },500);<%}%><%}%>
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
		$scope.changeState('main.<%- parentStateName %>.FIND', {id: 1}, response.data);
	});
};
