angular.module('views')
  .controller('mainController',
		  ['$rootScope','$scope','$state','$stateParams','$location', 'RestService', 'SocketService',
		   function ($rootScope,$scope,$state,$stateParams,$location, RestService, SocketService) {
				
				$scope.changeState = function(state, data){
					if(!data){
						data = {};
					}
				    $state.go(state,data,{location:true}).then(function(){});
				};
				
				var agents = {
					<% _.each(moduleNames.agents, function(agentName, index){%>'<%- agentName %>': '/<%- agentName %>'<% if(index != moduleNames.agents.length-1){%>,
					<% }}); %>
				}
				
				$scope.activeAgent = null;
				
				for(agent in agents){
					if(agents[agent] == $state.current.url){
						$scope.activeAgent = agents[agent];
						break;
					}
				}
				if(!$scope.activeAgent){
					console.log('stop all conversations');
				}
		  }
]);