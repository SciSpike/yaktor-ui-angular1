angular.module('<%- moduleName %>')
  .controller('<%- moduleName %><%- state.name %>Controller',
      ['$rootScope','$scope','$state','$stateParams','$location', 'RestService', 'SocketService', '<%- moduleName %>Services',
       function ($rootScope,$scope,$state,$stateParams,$location, RestService, SocketService, <%- moduleName %>Services) {
        
        $scope.changeState = function(view){
          $state.go($state.current.name + '.' + view, {}, {location:true});
        }
        
        if(!$stateParams.initData){
          $state.go('main.<%- moduleName %>.init',{},{location:true});
          }
        
        <% for(element in state.elements){
        var elementName = element.toLowerCase()%>
        $scope.on_<%- elementName%> = function(data){
          var data = data;
          var initData = null;
          if($stateParams.initData._id){
            initData = JSON.parse($stateParams.initData);
          }else{
            initData = {
              _id:$stateParams.initData
            };
          }
          <%- moduleName %>Services.on_<%- elementName%>(initData, data);
        }
        <%}%>
}]);