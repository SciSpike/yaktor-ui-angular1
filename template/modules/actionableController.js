angular.module('<%- moduleName %>')
  .controller('<%- moduleName %><%- state.name %>Controller',
		  ['$rootScope','$scope','$state','$stateParams','$location', 'RestService', 'SocketService',
		   function ($rootScope,$scope,$state,$stateParams,$location, RestService, SocketService) {
			  
$scope.directiveData = {};
<%
var createDirectives = function(elements){
	for(element in elements){
		if(elements[element].components){
			createDirectives(elements[element].components.elements);
		}else{
			var elementData = elements[element];%>
$scope.directiveData['<%- element %>'] = <%= JSON.stringify(elementData,null,2)%>;
$scope.directiveData['<%- element %>']['answer'] = '';
<%}}}

createDirectives(state.components.elements);%>

$scope.submitForm = function(type){
	var initData = {};
	for(key in $scope.directiveData){
		initData[key] = $scope.directiveData[key].answer;
	}
	if(type == 'init'){
		$scope.initConversation(initData);
	}else{
		var conversation = 'on' + type.replace(/\./g,'').toLowerCase();
		$scope[conversation](initData);
	}
}		  
}]);