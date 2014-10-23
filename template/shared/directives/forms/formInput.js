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
                  $scope.directiveData.endPoint = settingsInstances.getTyprRefsInstance('default');
                }
                typeRefService.getTypeRef($scope.directiveData.endPoint[$scope.directiveData.typeRef]).then(function(response){
                  $scope.directiveData.ui.data = response.results;
                });
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