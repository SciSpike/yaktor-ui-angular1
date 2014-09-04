angular.module('<%- moduleName %>')
  .controller('<%- moduleName %>Controller',
		  ['$rootScope','$scope','$state','$stateParams','$location', 'RestService', 'SocketService',
		   function ($rootScope,$scope,$state,$stateParams,$location, RestService, SocketService) {
	  
			  var stateName = 'main.init';
		      var id = $scope.id = $stateParams.id;
		      $scope.initData = {};
		      
		      function initConversation(initData){
		    	  if(SocketService['init']){
			            SocketService['init']('/<%- moduleName %>',initData, initData,function(err,stateName){
			              $state.go('main.<%- moduleName %>.' + stateName, {initData:JSON.stringify(initData)}, {location:true});
			            });
			        } else {
			            SocketService.doAction('/ClinicalTrials.AlertMonitor','init', initData, initData, function(err,data){
			            	
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