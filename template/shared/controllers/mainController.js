angular.module('views')
  .controller('mainController',
		  ['$rootScope','$scope','$state','$stateParams','$location', 'RestService', 'SocketService',
		   function ($rootScope,$scope,$state,$stateParams,$location, RestService, SocketService) {
			  $scope.$storage = $sessionStorage;
		    	
			  window.onresize = function(){
				  $rootScope.$emit($eventsCommon.ngGrid.toggleWidth);
			  }
		  }
]);