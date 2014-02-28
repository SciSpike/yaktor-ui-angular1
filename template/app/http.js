.state('<%-s.friendly%>', {
 url: '<%-s.proto.match(/ws:/)?s.url:stateName%>',
 templateUrl: 'partial/<%=controller%>.html',
 controller: '<%=controller%>Ctrl'
})
<% Object.keys(s.elements).forEach(function(actionableName){ 
var a = s.elements[actionableName]; %>
.state('<%-s.friendly%>.<%=actionableName%>', {
  url: '/<%=actionableName%><%-a.subPath%>',
  templateUrl: 'partial/<%=controller%>.<%=actionableName%>.html',
  controller:function($scope, $stateParams,RestService, SocketService) {
    var stateName = '<%=actionableName%>';
    var id = $scope.id = $stateParams.id;
    if(id){
      RestService['FINDBYID']('<%- s.url %>', null,id,function(err,data){
        $scope.data[stateName]=data;
        console.log("Loaded %s",$stateParams.id,$scope.data[stateName]);
      });
    }
    <%
      var actions= a.components.actions; 
      Object.keys(actions).forEach(function(a){
        var action = actions[a];
      %>
      // This method is called when using a REST API
      
          <% if(a.match(/find/i)){ %>
            $scope.currentPage=1; 
            
            $scope.on<%= a %> = function(notUsed,page) {
              page = page || 1;
              var data = $scope.data['<%= a %>'];
              RestService['<%= a %>']('<%- s.url%>', data,page,function(err,data){
                console.log("loading page:", JSON.stringify(data,null,2))
                $scope.table=data;
              });
            }
            //$scope.$watch( 'currentPage', $scope.on<%= a %> );
          <% } else {%>
            $scope.on<%= a %> = function(method) {
              var data = $scope.data[method];
              RestService[method]('<%- s.url%>', data,id,function(err,data){
                $scope.data[method]=data;
              });
            }
          <% }%>
    <%});%>
    
  }
})
<% }); %>
