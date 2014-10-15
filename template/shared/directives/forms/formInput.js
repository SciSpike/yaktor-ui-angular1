angular.module('views')
  .directive('engineUiFormInput', function($rootScope, $eventsCommon, $timeout) {
    return{
            restrict: 'C',
            template: '<div ng-include="getContentUrl()"></div>',
            scope: {
                directiveData: '='
            },
            controller: function($scope, $filter, clientSettings) {
              if($scope.directiveData.type == 'array'){
                if($scope.directiveData.ui.items.enum){
                  //This means there are the enum values constrain the set of valid values, hence radio or select / could be checkbox ???
                  $scope.directiveData.ui.type = clientSettings.forms.elementTypes.excMulti;
                }else{
                  if($scope.directiveData.ui.metaType && $scope.directiveData.ui.metaType == 'geo'){
                    //This is a special case and has set number of inputs, 2 in total - lat and lng
                    $scope.directiveData.ui.type = clientSettings.forms.elementTypes.geo;
                  }else{
                    //This is a group of inputs, initally 1, with the option to add more
                    $scope.directiveData.ui.type = clientSettings.forms.elementTypes.array;
                  }
                }
              }else{
                $scope.directiveData.ui.type = clientSettings.forms.elementTypes[$scope.directiveData.type];
              }
            },
            link: function(scope, element, attrs){
              scope.getContentUrl = function() {
                    return partialsBaseLocation + '/fragments/' + scope.directiveData.ui.type + '.html';
               }
              scope.addArrayItem = function(){
                scope.directiveData.answer.push("");
              }
            }
        }
  });