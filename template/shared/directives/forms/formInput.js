angular.module('views')
  .directive('engineUiFormInput', function($rootScope, $eventsCommon, $timeout, typeRefService) {
    return{
            restrict: 'C',
            template: '<div ng-include="getContentUrl()"></div>',
            scope: {
                directiveData: '=',
                key: '@'
            },
            controller: function($scope, $filter, defaultSettings, $state, settingsInstances) {
              if($scope.directiveData.typeRef){
                if(!$scope.directiveData.endPoint){
                  $scope.directiveData.endPoint = settingsInstances.getTypeRefsInstance('default');
                }
                if($scope.directiveData.endPoint[$scope.directiveData.typeRef]){
                  //NON-ASYNC
                  typeRefService.getTypeRef($scope.directiveData.endPoint[$scope.directiveData.typeRef]).then(function(response){
                    $scope.directiveData.ui.data = response.results;
                  });
                  //ASYNC
                  /*$scope.getLocation = function(val) {
                    typeRefService.getTypeRef($scope.directiveData.endPoint[$scope.directiveData.typeRef], val).then(function(response){
                      return response.results;
                    });
                  };*/
                }else{
                  $scope.directiveData.ui.type = 'string';
                }
                
              }
              $scope.directiveData.ui.type = defaultSettings.forms.elementTypes[$scope.directiveData.type];
              if($scope.directiveData.type == 'geo' || $scope.key == 'useCurrentLocation'){
                $rootScope.$on('maps.setCoords', function (e, data) {
                  if($scope.key == 'useCurrentLocation' && data.reset == true){
                    $scope.directiveData.answer = 'false';
                  }
                  if($scope.directiveData.type == 'geo'){
                    $scope.directiveData.answer = [data.lat, data.lng];
                  }
                });
              }
            },
            link: function(scope, element, attrs){
              scope.getContentUrl = function() {
                    return partialsBaseLocation + '/fragments/' + scope.directiveData.ui.type + '.html';
               }
              scope.addArrayItem = function(){
                scope.directiveData.answer.push("");
              }
              scope.booleanChange = function(data){
                if(scope.key == 'useCurrentLocation'){
                  $rootScope.$emit('maps.useCurrent', {useCurrent: data});
                }
              }
            }
        }
  });