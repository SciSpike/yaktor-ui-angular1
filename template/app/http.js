.state('<%-s.friendly%>', {
 url: '<%-stateName%>',
 templateUrl: 'partial/<%=controller%>.html',
 controller: '<%=controller%>Ctrl'
})
<% Object.keys(s.elements).forEach(function(actionableName){ 
var a = s.elements[actionableName]; %>
.state('<%-s.friendly%>.<%=actionableName%>', {
  url: '/<%=actionableName%><%-a.subPath%>',
  templateUrl: 'partial/<%=controller%>.<%=actionableName%>.html',
  controller:function($scope, $stateParams,RestService, SocketService,$translate) {
    var stateName = '<%=actionableName%>';
    var id = $scope.params.id= $stateParams.id;
    if(id){
      RestService['FINDBYID']('<%- s.url %>', null,id,function(err,data){
        $scope.data[stateName]=data;
        console.log("Loaded %s",$stateParams.id,$scope.data[stateName]);
      });
    }
    <%
      var actions= a.components.actions; 
      Object.keys(actions).forEach(function(act){
        var action = actions[act];
      %>
      // This method is called when using a REST API
      
      <% if(act.match(/find/i)){ %>
        $scope.currentPage=1; 
        
        $scope.gridOptions = {
            data: 'table.results',
//            enableCellSelection: true,
//            enableRowSelection: false,
//            enableCellEditOnFocus: true,
            columnDefs: [
                         <% 
                         console.log(a.components);
                         var elems =a.components.elements;
                         Object.keys(elems).forEach(function(elem){
                           var element=elems[elem];
                         %>
                         {field: '<%-elem%>', headerCellTemplate:"<span>{{'<%-element.ui.title%>'|translate}}</span>"}, 
                        <%});%>
                        ]
        }
        
        $scope.on<%= act %> = function(notUsed,page) {
          page = page || 1;
          var data = $scope.data['<%= act %>'];
          RestService['<%= act %>']('<%- s.url%>', data,page,function(err,data){
            console.log("loading page:", JSON.stringify(data,null,2))
            $scope.table=data;
          });
        }
        //$scope.$watch( 'currentPage', $scope.on<%= act %> );
      <% } else {%>
        $scope.on<%= act %> = function() {
          var data = $scope.data['<%= act %>'];
          RestService['<%= act %>']('<%- s.url%>', data,id,function(err,data){
            $scope.data['<%= act %>']=data;
          });
        }
      <% }%>
    <%});%>
    
  }
})
<% }); %>
