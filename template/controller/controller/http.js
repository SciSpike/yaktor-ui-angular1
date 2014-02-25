  $scope.data = $scope.data || {};
  console.log($stateParams);
  <% scopeVariables.forEach(function(sv){ %>
    $scope.data['<%=sv.stateName%>'] = {};
    <% sv.variables.forEach(function(v){ %>
      $scope.data['<%=sv.stateName%>']['<%=v.variable%>'] = <%=v.type%>;
    <% }); %>
  <% }); %>