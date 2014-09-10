angular.module('<%- moduleName %>')
  .controller('<%- moduleName %><%- state.name %>Controller',
		  ['$rootScope','$scope','$state','$stateParams','$location', 'RestService', 'SocketService',
		   function ($rootScope,$scope,$state,$stateParams,$location, RestService, SocketService) {
			  
			  $scope.directiveData = {};
			  <%
			  var directiveData = {};
			  var createDirectives = function(dataObject, elements){
			  	for(element in elements){
			  		if(elements[element].components){
			  			dataObject[element] = {};
			  			createDirectives(dataObject[element], elements[element].components.elements);
			  		}else{
			  			var elementData = elements[element];
			  			dataObject[element] = elementData;
			  			dataObject[element]['answer'] = '';
			  		}	
			  	}%>
$scope.directiveData = <%= JSON.stringify(dataObject,null,2)%>;
			  <%}
			  createDirectives(directiveData, state.components.elements);%>
			  
			  var answers = {};
			  function returnAnswers(dataObject, answers){
				  for(key in dataObject){
					  if(dataObject[key].answer){
						  answers[key] = dataObject[key].answer;
					  }else{
						  answers[key] = {};
						  returnAnswers(dataObject[key], answers[key]);
					  }
				  }
				  return answers;
			  }

$scope.submitForm = function(type){
	var data = returnAnswers($scope.directiveData, answers);
	type = type.toLowerCase();
	if(type == '_init'){
		$scope.initConversation(data);
	}else{
		var conversation = 'on' + type.replace(/\./g,'');
		console.log(conversation);
		$scope[conversation](data);
	}
}		  
}]);