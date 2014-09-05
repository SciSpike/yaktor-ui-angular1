angular.module('<%- moduleName %>')
  .controller('<%- moduleName %><%- state.name %>Controller',
		  ['$rootScope','$scope','$state','$stateParams','$location', 'RestService', 'SocketService',
		   function ($rootScope,$scope,$state,$stateParams,$location, RestService, SocketService) {
			  
			  $scope.view = '';
			  $scope.changeView = function(view){
				  $scope.view = view;
			  }
			  
			  if($stateParams.initData){
		    	  	//TO DO
		      }
			  <% for(element in state.elements){%>
			  $scope.on<%- element%> = function(initData){
				  var initData = initData;
				  if(SocketService['<%- element%>']){
					  SocketService['<%- element%>']('<%- state.url%>',initData, initData,function(err,stateName){
							$state.go('main.<%- moduleName %>' + stateName + '.views', {initData:JSON.stringify(initData)}, {location:true});
					  });
				  } else {
					  SocketService.doAction('<%- state.url%>', initData, initData, function(err,data){
					  });
				  }
			  }
		<%}%>
}]);