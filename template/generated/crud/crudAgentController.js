angular.module('<%- parentStateName %>')
  .controller('<%- parentStateName %>AgentController',
      ['$rootScope','$scope','$state','$stateParams', '$location', '$eventsCommon', '$timeout', '$translate', '$filter', '$controller', 'FormService', 'clientConstants', '<%- parentStateName %>Services',
       function ($rootScope, $scope, $state, $stateParams, $location, $eventsCommon, $timeout, $translate, $filter, $controller, FormService, clientConstants, <%- parentStateName %>Services) {
          
     
<%= crudControllerContents %>

}]);