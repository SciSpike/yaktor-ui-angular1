
angular.module('SodaPurchaser')
  .controller('{{name}}Ctrl', ['$scope', 'SocketService', function ($scope, SocketService) {
    $scope.data = {};
    
    {{#scopeVariables}}
    $scope.data.{{stateName}} = {};
    {{#variables}}
    $scope.data.{{stateName}}.{{variable}} = {{type}};
    {{/variables}}
    
    {{/scopeVariables}}
    
    // TODO: Use the SocketService to push events with data to the server
    $scope.$on('$stateChangeStart', function(e, toState, toParams, fromState, fromParams) {
      console.log($scope.data);
    });
  
}]);