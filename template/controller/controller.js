//THIS REALLY ISN'T NEEDED
angular.module('<%=appname%>')
  .controller('<%-actionables.friendly%>Ctrl', ['$scope','$state','$stateParams','$location', 'RestService', 'SocketService', function ($scope,$state,$stateParams,$location, RestService, SocketService) {
    $scope.go = function(hash){
      $location.path(hash);
    }
    
    $scope.htmlTooltip = '<span ng-click="$emit(\'rowClick\', row);">edit</span>';
    
    <% if(actionables.proto.match(/http:/)){

      %><% include controller/http.js%><%
    } else {

      %><% include controller/ws.js%><%
      %>
      $scope.goState = function(stateName){
        !$state.includes(stateName) && $state.go(stateName,null,{location:false});
      }  
      <% var actions = Object.keys(actionables.elements);
      if (actions.length >0){%>
        $scope.goState('<%-actionables.friendly %>.<%-actions[0]%>')
      <%}%>
  <% 
    }  %>
    
  
}]);