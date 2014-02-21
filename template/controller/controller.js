//THIS REALLY ISN'T NEEDED
angular.module('<%=appname%>')
  .controller('<%-name%>Ctrl', ['$scope','$stateParams','$location', 'RestService', 'SocketService', function ($scope,$stateParams,$location, RestService, SocketService) {
    $scope.go = function(hash){
      $location.path(hash);
    }
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