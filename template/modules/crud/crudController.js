angular.module('<%- parentStateName %>')
  .controller('<%- parentStateName %><%- moduleName %>Controller',
      ['$rootScope','$scope','$state','$stateParams', '$location', '$eventsCommon', '$timeout', '$translate',  'FormService', 'clientConstants', '<%- parentStateName %>Services',
       function ($rootScope,$scope,$state,$stateParams, $location, $eventsCommon, $timeout, $translate, FormService, clientConstants, <%- parentStateName %>Services) {
          
          //set ourselves up to be able to return here if we leap over to an agent
          $rootScope.setFromCrud(false);
          $rootScope.setReturnToCrud($state.current.name);
          if ($stateParams){
        	  $rootScope.setReturnToParams($stateParams);
          }else{
        	  $rootScope.setReturnToParams({});
          }

        //CRUD STUFF
	var id = $stateParams.id;
	$scope.userId = id;
     
<%= crudControllerContents %>

}]);