//THIS REALLY ISN'T NEEDED
angular.module('<%=appname%>')
  .controller('<%-name%>Ctrl', ['$scope','$stateParams', 'RestService', 'SocketService', function ($scope,$stateParams, RestService, SocketService) {
    
     $scope.data = {};
    console.log($stateParams);
    <% scopeVariables.forEach(function(sv){ %>
      $scope.data['<%=sv.stateName%>'] = {};
      <% sv.variables.forEach(function(v){ %>
        $scope.data['<%=sv.stateName%>']['<%=v.variable%>'] = <%=v.type%>;
      <% }); %>
    <% }); %>
    $scope.currentAction = null;
    
    $scope.onAction = function(action) {
      $scope.currentAction = action;
    }
  
}]);