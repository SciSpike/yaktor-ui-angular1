angular.module('<%- moduleName %>')
  .controller('<%- moduleName %><%- state.name %>Controller',
		  ['$rootScope','$scope','$state','$stateParams','$location', 'RestService', 'SocketService',
		   function ($rootScope,$scope,$state,$stateParams,$location, RestService, SocketService) {
			  
			  $scope.directiveData = {};
			  <% for(element in state.components.elements){
				  var elementData = state.components.elements[element];
			  %>
				  $scope.directiveData['<%- element %>'] = <%= JSON.stringify(elementData,null,2)%>;
			  <%}%>
			  
			  $scope.$watchCollection('directiveData', function(newValue, oldValue) {
				  console.log(newValue);
	          });
			  
		  }
  ]);