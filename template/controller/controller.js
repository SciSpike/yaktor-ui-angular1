//THIS REALLY ISN'T NEEDED
angular.module('<%=appname%>')
  .controller('<%-actionables.friendly%>Ctrl', ['$scope','$state','$stateParams','$location', 'RestService', 'SocketService', function ($scope,$state,$stateParams,$location, RestService, SocketService) {
    $scope.go = function(hash){
      $location.path(hash);
    }
    <% if(actionables.proto.match(/http:/)){

      %><% include controller/http.js%><%
    } else {

      %><% include controller/ws.js%><%

      if(!!!statename.match(/:state:/)){
        %>
        $scope.goState = function(stateName){
          try {
            $state.go(stateName,null,{location:false});
          } catch (e) {
            try {
              $state.go("^"+stateName,null,{location:false});
            } catch(e){
              $state.go("^.^"+stateName,null,{location:false});
            }
          }
        }  
        <% 
      }
      
    } %>
  
}]);