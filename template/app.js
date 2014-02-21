(function() {
  'use strict';
  
  angular.module('<%=appname%>', ['ui.bootstrap', 'ui.router'])
    .config(function($stateProvider, $locationProvider) {
      
      $stateProvider
        
        <% Object.keys(states).forEach(function(stateName){ 
           var s = states[stateName]; 
           var controller = stateName.replace("/","_");%>
        .state('<%-stateName%>', {
          url: '<%-s.url%>',
          templateUrl: 'partial/<%=controller%>.html',
          controller: '<%=controller%>Ctrl'
        })
        <% Object.keys(s.elements).forEach(function(actionableName){ 
           var a = s.elements[actionableName]; %>
        .state('<%-stateName%>.<%=actionableName%>', {
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