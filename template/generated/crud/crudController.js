angular.module('<%- parentStateName %>')
  .controller('<%- parentStateName %><%- moduleName %>Controller',
      ['$rootScope','$scope','$state','$stateParams', '$location', '$eventsCommon', '$timeout', '$translate', '$filter', 'FormService', 'clientConstants', '<%- parentStateName %>Services',
       function ($rootScope,$scope,$state,$stateParams, $location, $eventsCommon, $timeout, $translate, $filter, FormService, clientConstants, <%- parentStateName %>Services) {
          
          //set ourselves up to be able to return here if we leap over to an agent
          $rootScope.setFromCrud(false);
          $rootScope.setReturnToCrud($state.current.name);
          var params =  $stateParams || {};
          $rootScope.setReturnToParams(params);
          var id = params.id || null;
          $scope.userId = id;
     
<%= crudControllerContents %>

}]);