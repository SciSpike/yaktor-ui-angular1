angular.module('<%- moduleName %>')
  .controller('<%- moduleName %>Controller',
		  ['$rootScope','$scope','$state','$stateParams','$location', 'RestService', 'SocketService',
		   function ($rootScope,$scope,$state,$stateParams,$location, RestService, SocketService) {
	  
			  var stateName = 'main.init';
		      var id = $scope.id = $stateParams.id;
		      $scope.initData = {};
		      
		      function initConversation(initData){
		    	  var initData = initData;
		    	  if(SocketService['init']){
			            SocketService['init']('<%- actions.url%>',initData, initData,function(err,stateName){
			            	var nextState = stateName.replace('state:', '');
			              $state.go('main.<%- moduleName %>' + nextState + '.views', {initData:JSON.stringify(initData)}, {location:true});
			            });
			        } else {
			            SocketService.doAction('<%- actions.url%>','init', initData, initData, function(err,data){
			            	
			            });
			        }
		      }
		      
		      if($stateParams.initData){
		    	  	var initData = JSON.parse($stateParams.initData);
			        initConversation(initData);
		      }else{
		    	  $state.go('main.<%- moduleName %>.init',{},{location:true});
		      }
		      
		      $scope.initConversation = function(initData){
		    	  initConversation(initData);
		      }
			  
}]);