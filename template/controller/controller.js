
angular.module('{{appname}}')
  .controller('{{name}}Ctrl', ['$scope', 'RestService', 'SocketService', function ($scope, RestService, SocketService) {
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
    
    // This method is called when using a REST API
    $scope.onSubmit = function(method) {
      var data = $scope.data[method];
      RestService[method]('{{endpoint}}', data);
    }
  
}]);