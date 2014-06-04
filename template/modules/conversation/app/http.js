.state('main.<%-s.friendly%>', {
 url: '<%-stateName%>',
 templateUrl: 'modules/conversation/partial/<%=controller%>.html',
 controller: '<%=controller%>Ctrl'
})
<% Object.keys(s.elements).forEach(function(actionableName){ 
var a = s.elements[actionableName]; %>
.state('main.<%-s.friendly%>.<%=actionableName%>', {
  url: '/<%=actionableName%><%-a.subPath%>',
  templateUrl: 'modules/conversation/partial/<%=controller%>.<%=actionableName%>.html',
  controller:function($scope, $stateParams,RestService, SocketService,$translate) {
    $scope.alerts=[];
    var id = $scope.params.id= $stateParams.id;
    if(id){
      RestService['FINDBYID']('<%- s.url %>', null,id,function(err,data){
        $scope.data[ '<%=actionableName%>']=data;
        console.log("Loaded %s",$stateParams.id,$scope.data[ '<%=actionableName%>']);
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
            enablePinning: true,
            enableColumnResize: true,
            init:function(grid,$scope){
              console.log(arguments)
              $scope.viewportStyle=function(){
                return { };
              }
            },
            columnDefs: [
                         <% 
                         var elems =a.components.elements;
                         Object.keys(elems).forEach(function(elem, index, test){
                           var width = 'auto';
                           if(index == test.length-1){
                             width = '*';
                           }
                           var element=elems[elem];
                           if(element.type.match(/^object|array$/)){
                             //DON'T RENDER
                             return;
                           }
                         %>
                         {
                           field: '<%-elem%>',
                           width: '<%-width%>',
                           minWidth: 150,
                           resizable: true,
                           headerCellTemplate:"<div>{{'<%-element.ui.title%>'|translate}}</div>" +
                              "<div class='ngSortButtonDown ng-hide' ng-show='col.showSortButtonDown()'></div>" +
                              "<div class='ngSortButtonUp ng-hide' ng-show='col.showSortButtonUp()'></div>" +
                           	  "<div ng-class='{ ngPinnedIcon: col.pinned, ngUnPinnedIcon: !col.pinned }' ng-click='togglePin(col)' ng-show='col.pinnable' class='ngPinnedIcon'></div>" +
                           		"<div ng-show='col.resizable' class='ngHeaderGrip ng-scope' ng-click='col.gripClick($event)' ng-mousedown='col.gripOnMouseDown($event)'></div>"
                         }, 
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
            if(err){
                console.log(err)
                $scope.alerts.push(err);
            } else {
              $scope.data['<%= act %>']=data;
            }
          });
        }
      <% }%>
    <%});%>
    
  }
})
<% }); %>
