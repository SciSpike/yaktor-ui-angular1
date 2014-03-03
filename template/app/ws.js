  .state('<%- s.friendly%>', {
   url: '/<%-stateName.replace(/.*:state:/,"")%>',
   templateUrl: 'partial/<%=controller%>.html',
   controller: '<%=controller%>Ctrl'
  })
  <% Object.keys(s.elements).forEach(function(actionableName){ 
  var a = s.elements[actionableName]; 
  
  %>
  .state('<%-s.friendly %>.<%=actionableName%>', {
    templateUrl: 'partial/<%=controller%>.<%=actionableName%>.html',
    //Allows custom controllers to pass in a string data blob on transition;
    params:['initData'],
    controller:function($scope, $stateParams,RestService, SocketService) {
      var stateName = '<%=actionableName%>';
      var id = $scope.id = $stateParams.id;
      <%
        var actions= a.components.actions; 
        Object.keys(actions).forEach(function(a){
          var action = actions[a];
        %>
        // This method is called when using a REST API
        $scope.on<%= a %> = function(method) {
          var data = $scope.data[method];
          var initData = $scope.data['init'];
          if(SocketService[method]){
            SocketService[method]('<%-s.url%>',initData, data,function(err,stateName){
              $scope.goState('<%-s.friendly.replace(/\.state.*/,"") %>'+stateName)
            });
          } else {
            SocketService.doAction('<%-s.url%>','<%-actionableName%>',initData,data,function(err,data){
            });
          }
        }
      <%});%>
      
    }
  })
  <% }); %>
