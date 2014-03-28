  .state('<%- s.friendly%>', {
    <%if(stateName.match(/:state/)){%>
    params:['initData'],
    <%} else {%>
    url: '/<%-stateName.replace(/.*:state:/,"")%>',
    <% }%>
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
    controller:function($scope,$state, $stateParams,RestService, SocketService) {
      var stateName = '<%=actionableName%>';
      var id = $scope.id = $stateParams.id;
      if($stateParams.initData){
        console.log($stateParams)
        $scope.data['init']=JSON.parse($stateParams.initData);
      }
      <%
        var actions= a.components.actions; 
        Object.keys(actions).forEach(function(a){
          var action = actions[a];
        %>
        // This method is called when using a REST API
        $scope.on<%= a %> = function() {
          var data = $scope.data['<%= a %>'];
          var initData = $scope.data['init'];
          if(SocketService['<%= a %>']){
            SocketService['<%= a %>']('<%-s.url%>',initData, data,function(err,stateName){
              $state.go('<%-s.friendly.replace(/\.state.*/,"") %>'+stateName,{initData:JSON.stringify(initData)},{location:true});
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
