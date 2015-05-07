angular.module('<%- moduleName %>')
  .controller('<%- moduleName %>Controller',
      ['$rootScope','$scope','$state','$stateParams','$location', 'RestService', 'SocketService', '<%- moduleName %>Services', '$eventsCommon',
       function ($rootScope,$scope,$state,$stateParams,$location, RestService, SocketService, <%- moduleName %>Services, $eventsCommon) {
    
        var stateName = 'main.init';
        
          $scope.initData = {};
          
          function init<%- moduleName %>Conversation(initData){
            var initData = initData;
            <%- moduleName %>Services.initConversation(initData);
          }
          
          $scope.$onRootScope($eventsCommon.conversations.<%- actions.url.replace('/', '')%>, function(event, data){
            if(window.fromCrud){
              $scope.changeState(window.fromCrud);
            }
            if(data.nextState && !window.fromCrud){
                $scope.changeState('main.<%- moduleName %>' + data.nextState, {initData:JSON.stringify(data.data)});
            }
            });
            
          
          if($stateParams.initData){
            var initData = null;
            if($stateParams.initData._id){
              initData = JSON.parse($stateParams.initData);
              init<%- moduleName %>Conversation(initData);
            }
          }else{
            $state.go('main.<%- moduleName %>.init',{},{location:true});
          }
          
          $scope.init<%- moduleName %>Conversation = function(initData){
            init<%- moduleName %>Conversation(initData);
          }
        
}]);