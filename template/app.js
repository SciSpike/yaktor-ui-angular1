(function() {
  'use strict';
  
  angular.module('<%=appname%>', ['ui.bootstrap', 'ui.router'])
    .config(function($stateProvider, $locationProvider) {
      
      $stateProvider
        
        <% states.forEach(function(s){ %>
        .state('<%-s.name%>', {
          url: '<%-s.url%>',
          templateUrl: 'partial/<%=s.controller%>.html',
          controller: '<%=s.controller%>Ctrl'
        })
        <% s.actionables.forEach(function(a){ %>
        .state('<%-s.name%>.<%=a.actionableName%>', {
          url: '/<%=a.actionableName%><%-a.subPath%>',
          templateUrl: 'partial/<%=s.controller%>.<%=a.actionableName%>.html',
          controller:function($scope, $stateParams,RestService, SocketService) {
            var stateName = '<%=a.actionableName%>';
            var id = $scope.id = $stateParams.id;
            if(id){
              RestService['FINDBYID']('<%- s.url %>', null,id,function(err,data){
                $scope.data[stateName]=data;
                console.log("Loaded %s",$stateParams.id,$scope.data[stateName]);
              });
            }
            <% 
              var actions= a.actionable.components.actions; 
              Object.keys(actions).forEach(function(a){
                var action = actions[a];
              %>
              // This method is called when using a REST API
              $scope.on<%= a %> = function(method) {
                var data = $scope.data[method];
                RestService[method]('<%- s.url%>', data,id,function(err,data){
                  $scope.data[method]=data;
                });
              }
            <%});%>
            
          }
        })
        <% }); 
        });%>
      
    });

})();