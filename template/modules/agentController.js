angular.module('<%- moduleName %>')
  .controller('<%- moduleName %><%- state.name %>Controller',
		  ['$rootScope','$scope','$state','$stateParams','$location', 'RestService', 'SocketService',
		   function ($rootScope,$scope,$state,$stateParams,$location, RestService, SocketService) {
			  
			  $scope.changeState = function(view){
				  $state.go($state.current.name + '.' + view, {}, {location:true});
			  }
			  
			  if(!$stateParams.initData){
				  $state.go('main.<%- moduleName %>.init',{},{location:true});
		      }
			  
			  <% for(element in state.elements){
			  var elementName = element.toLowerCase()%>
			  $scope.on_<%- elementName%> = function(data){
				  var data = data;
				  if(SocketService['<%- element%>']){
					  console.log('Should not be here');
					  SocketService['<%- element%>']('<%- state.url%>',data, data, function(err,stateName){
							$state.go('main.<%- moduleName %>' + stateName, {initData:JSON.stringify(initData)}, {location:true});
					  });
				  } else {
					  SocketService.doAction('<%- parentUrl%>', '<%- element%>', $stateParams.initData, data, function(err,data){
						  if(err){
							  console.log(err);
						  }else{
							  console.log(data);
						  }
					  });
				  }
			  }
			  <%}%>
}]);