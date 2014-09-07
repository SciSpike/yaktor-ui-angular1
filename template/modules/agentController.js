angular.module('<%- moduleName %>')
  .controller('<%- moduleName %><%- state.name %>Controller',
		  ['$rootScope','$scope','$state','$stateParams','$location', 'RestService', 'SocketService',
		   function ($rootScope,$scope,$state,$stateParams,$location, RestService, SocketService) {
			  
			  $scope.changeState = function(view){
				  $state.go($state.current.name + '.' + view, {}, {location:true});
			  }
			  
			  if($stateParams.initData){
		    	  	//TO DO
		      }
			  <% for(element in state.elements){
			  var elementName = element.toLowerCase()%>
			  $scope.on_<%- elementName%> = function(initData){
				  var initData = initData;
				  if(SocketService['<%- element%>']){
					  SocketService['<%- element%>']('<%- state.url%>',initData, initData,function(err,stateName){
							$state.go('main.<%- moduleName %>' + stateName, {initData:JSON.stringify(initData)}, {location:true});
					  });
				  } else {
					  SocketService.doAction('<%- state.url%>', initData, initData, function(err,data){
					  });
				  }
			  }
		<%}%>
}]);