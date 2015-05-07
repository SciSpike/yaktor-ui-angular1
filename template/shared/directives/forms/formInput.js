angular.module('views')
  .directive('engineUiFormInput', function($rootScope, $eventsCommon, $timeout, typeRefService) {
    return{
            restrict: 'C',
            template: '<div ng-include="getContentUrl()"></div>',
            scope: {
                directiveData: '=',
                key: '@'
            },
            controller: function($rootScope, $scope, $filter, $state, $modal, $translate, defaultSettings, settingsInstances) {
              if($scope.directiveData.typeRef){
                if(!$scope.directiveData.endPoint){
                  $scope.directiveData.endPoint = settingsInstances.getTypeRefsInstance('default');
                }
                if($scope.directiveData.endPoint[$scope.directiveData.typeRef]){
                  //set endpoint in case we need to call on it elsewhere
                  $scope.directiveData.ui.endPoint = $scope.directiveData.endPoint[$scope.directiveData.typeRef];
                  //NON-ASYNC
                  typeRefService.getTypeRef($scope.directiveData.endPoint[$scope.directiveData.typeRef]).then(function(response){
                    $scope.directiveData.ui.data = response.results;
                  });
                  //ASYNC
                  $scope.getLocation = function(val) {
                    var data = {};
                    data.title = "/"+val+".*/";
                    typeRefService.getTypeRef($scope.directiveData.endPoint[$scope.directiveData.typeRef], data).then(function(response){
                          $scope.directiveData.ui.data = response.results;
                    });
                  };
 
                  $scope.createNew = function(){
                    var objectRef = "";
                    $translate($scope.directiveData.ui.title).then(function(translated){
                      objectRef = translated.toLowerCase();
                      var skope = $rootScope.$new();

                      skope.abort = function(){
                        modalInstance.dismiss();
                      };

                      skope.changeState = function(state, query, newItem){
                        //ignore state and query here, this is just a a spoof to get what we need and avoid a goofy error
                        if (newItem){
                          typeRefService.getTypeRef($scope.directiveData.endPoint[$scope.directiveData.typeRef], {}).then(function(response){
                                $scope.directiveData.ui.data = response.results;
                                $scope.directiveData.answer = newItem;
                                modalInstance.close();
                          });
                        }else{
                          skope.abort();
                        }
                      }
                    
                      var modalInstance = $modal.open({
                        size:"lg",
                        templateUrl: 'partials/crud/'+objectRef+'/POST.html',
                        controller: objectRef + 'POSTController',
                        scope:skope
                      });
                    });
                  };
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
                if (scope.directiveData.ui.type) {
                  // console.log(scope.directiveData.ui.type.toLowerCase());
                  return partialsBaseLocation + '/fragments/' + scope.directiveData.ui.type.toLowerCase() + '.html';
                } else {
                  return "";
                }
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