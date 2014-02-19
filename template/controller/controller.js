
angular.module('<%=appname%>')
  .controller('<%-name%>Ctrl', ['$scope', 'RestService', 'SocketService', function ($scope, RestService, SocketService) {
     $scope.data = {};
    
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
    
    // TODO: Use the SocketService to push events with data to the server
    $scope.$on('$stateChangeStart', function(e, toState, toParams, fromState, fromParams) {
      var stateName = toState.name;
      console.log($scope.data[stateName]);
    });
    
    <% var ae = actionables.elements%>
    <% Object.keys(ae).forEach(function(elem){ %>
      <% var actionable = ae[elem] %>
      <% var actions = actionable.components.actions %>
      <% Object.keys(actions).forEach(function(action){ %>
        //<%- action %>
        <% var a = actions[action] %>
        // This method is called when using a REST API
        $scope.on<%= action %> = function(method) {
          var data = $scope.data[method];
          RestService[method]('<%- actionables.url%><%- actionable.subPath%>', data);
        }
      <% }); %>
    <% }); %>
  
}]);