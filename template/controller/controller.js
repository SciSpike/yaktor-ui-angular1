
// TODO: Move $http to a service similar to SocketService
angular.module('{{appname}}')
  .controller('{{name}}Ctrl', ['$scope', '$http', 'SocketService', function ($scope, $http, SocketService) {
    $scope.data = {};
    
    {{#scopeVariables}}
    $scope.data.{{stateName}} = {};
    {{#variables}}
    $scope.data.{{stateName}}.{{variable}} = {{type}};
    {{/variables}}
    
    {{/scopeVariables}}
    
    // TODO: Use the SocketService to push events with data to the server
    $scope.$on('$stateChangeStart', function(e, toState, toParams, fromState, fromParams) {
      var stateName = toState.name;
      console.log($scope.data[stateName]);
    });
    
    // Define CRUD methods for REST API
    function POST(data) {
      console.log(data);
      
      $http.post("http://localhost:3000", data)
        .success(function(data, status, headers, config) {
          console.log(data, status, headers, config);
        })
        .error(function(data, status, headers, config) {
          console.log("ERROR:", data, status, headers, config);
        });
    }
    
    $scope.onSubmit = function(method) {
      POST($scope.data[method]);
    }
  
}]);