angular.module('views')
  .controller('mainController',
      ['$rootScope','$scope','$state','$stateParams','$location', 'RestService', 'SocketService',
       function ($rootScope,$scope,$state,$stateParams,$location, RestService, SocketService) {
        
        $scope.$on('$stateNotFound', function(event, unfoundState, fromState, fromParams){
          event.preventDefault();
          
          $scope.changeState('main.home');
        });
        
        $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
            // event.preventDefault();
            console.log("***********STATE SUCCESS TO**************     ", toState);

            if($rootScope.fromCrud){
              // $rootScope.returnToCrud = fromState.name;
              if (fromParams){
                // $rootScope.fromParams = fromParams;
              }
              console.log("***********STATE SUCCESS FROM**************     ", fromState);
            }
            
            // transitionTo() promise will be rejected with
            // a 'transition prevented' error
        });

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