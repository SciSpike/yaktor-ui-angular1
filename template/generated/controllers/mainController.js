angular.module('views')
  .controller('mainController', ['$rootScope', '$scope', '$state', '$stateParams', '$location', 'RestService', 'SocketService',
    function($rootScope, $scope, $state, $stateParams, $location, RestService, SocketService) {
      
      $scope.$on('$stateNotFound', function(event, unfoundState, fromState, fromParams) {
        event.preventDefault();

        $scope.changeState('main.home');
      });

      $scope.changeState = function(state, data) {
        if (!data) {
          data = {};
        }
        $state.go(state, data, {
          location: true
        }).then(function() {});
      };

      $scope.objectFindByKey = function(array, key, value) {
        for (var i = 0; i < array.length; i++) {
          if (array[i][key] == value) {
            return array[i];
          }
        }
        return null;
      };
            
      var agents = { <% _.each(moduleNames.agents, function(agentName, index) { %> '<%=agentName %>': '/<%=agentName %>' <%
          if (index != moduleNames.agents.length - 1) { %> , <%
          }
        }); %>
      }

      $scope.MergeRecursive = function(obj1, obj2) {
        for (var p in obj2) {
          try {
            if ( obj2[p].constructor==Object ) {
              obj1[p] = MergeRecursive(obj1[p], obj2[p]);
            } else {
              obj1[p] = obj2[p];
            }
          } catch(e) {
            obj1[p] = obj2[p];
          }
        }
        return obj1;
      };
      
      
      $scope.activeAgent = null;

      for (agent in agents) {
        if (agents[agent] == $state.current.url) {
          $scope.activeAgent = agents[agent];
          break;
        }
      }
      if (!$scope.activeAgent) {
        console.log('stop all conversations');
      }
    }
  ]);
