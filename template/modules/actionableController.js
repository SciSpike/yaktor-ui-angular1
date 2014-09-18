angular.module('<%- moduleName %>')
  .controller('<%- moduleName %><%- state.name %>Controller',
		  ['$rootScope','$scope','$state','$stateParams','$location', 'RestService', 'SocketService',
		   function ($rootScope,$scope,$state,$stateParams,$location, RestService, SocketService) {
			  <%var directiveData = {};
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
			  <%}
			  createDirectives(directiveData, state.components.elements);%>
			  
			  $scope.directiveData = <%= JSON.stringify(directiveData,null,2)%>;
			  
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
	type = type.replace('_', '').toLowerCase();
	if(type == 'init'){
		$scope.init<%- moduleName %>Conversation(data);
	}else{
		var conversation = 'on_' + type.replace(/\./g,'');
		console.log(conversation);
		$scope[conversation](data);
	}
}		  
}]);