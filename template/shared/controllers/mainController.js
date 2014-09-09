angular.module('views')
  .controller('mainController',
		  ['$rootScope','$scope','$state','$stateParams','$location', 'RestService', 'SocketService',
		   function ($rootScope,$scope,$state,$stateParams,$location, RestService, SocketService) {
				
				$scope.changeState = function(state, data){
					console.log(state);
					console.log(data);
					if(!data){
						data = {};
					}
				    $state.go(state,data,{location:true}).then(function(){});
				};
			  
		  }
]);