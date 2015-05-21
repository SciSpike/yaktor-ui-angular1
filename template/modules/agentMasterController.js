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
          
          $scope.$onRootScope($eventsCommon.conversations.<%- actions.url.replace('/', '')%>, function(event, eventData){
            var init = null;
            if($rootScope.fromCrud){
              $scope.changeState($rootScope.returnToCrud, $rootScope.returnToParams);
            }
            if(eventData.nextState && !$rootScope.fromCrud){
              if (eventData.data._id){
                init= eventData.data._id;
              }else{
                init = eventData.data;
              }
                $scope.changeState('main.<%- moduleName %>' + eventData.nextState, {initData: init});
            }
            });
            
          if($stateParams.initData && $state.current.name == 'main.<%- moduleName %>'){
            var initData = null;
            if($stateParams.initData._id){
              initData = JSON.parse($stateParams.initData);
              init<%- moduleName %>Conversation(initData);
            }
          }
          
          if(!$stateParams.initData && $state.current.name == 'main.<%- moduleName %>'){
              $state.go('main.<%- moduleName %>.init',{},{location:true});
          }
          
          
          $scope.init<%- moduleName %>Conversation = function(initData){
            init<%- moduleName %>Conversation(initData);
          }
        
}]);