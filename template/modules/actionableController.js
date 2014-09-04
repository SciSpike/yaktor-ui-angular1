angular.module('<%- moduleName %>')
  .controller('<%- moduleName %><%- state.name %>Controller',
		  ['$rootScope','$scope','$state','$stateParams','$location', 'RestService', 'SocketService',
		   function ($rootScope,$scope,$state,$stateParams,$location, RestService, SocketService) {
			  
$scope.directiveData = {};
<% for(element in state.components.elements){
var elementData = state.components.elements[element];
%>
$scope.directiveData['<%- element %>'] = <%= JSON.stringify(elementData,null,2)%>;
$scope.directiveData['<%- element %>']['answer'] = null;
<%}%>
			  
$scope.$watchCollection('directiveData', function(newValue, oldValue) {
	console.log(newValue);
});

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