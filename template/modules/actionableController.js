angular.module('<%- moduleName %>')
  .controller('<%- moduleName %><%- state.name %>Controller',
		  ['$rootScope','$scope','$state','$stateParams','$location', 'RestService', 'SocketService',
		   function ($rootScope,$scope,$state,$stateParams,$location, RestService, SocketService) {
			  
$scope.directiveData = {};
$scope.directiveAnswer = {};
<%
var createDirectives = function(elements){
	for(element in elements){
		if(elements[element].components){
			createDirectives(elements[element].components.elements);
		}else{
			var elementData = elements[element];%>
$scope.directiveData['<%- element %>'] = <%= JSON.stringify(elementData,null,2)%>;
$scope.directiveAnswer['<%- element %>'] = null;
		<%}
	}
}
createDirectives(state.components.elements);%>

$scope.submitForm = function(type){
	if(type.toLowerCase() == 'init'){
		var initData = {};
		for(element in $scope.directiveData){
			initData[element] = $scope.directiveData[element]['answer']
		}
		$scope.initConversation(initData);
	}else{
		
	}
}
			  
}
]);