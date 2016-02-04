angular.module('views')
  .directive('engineUiFormInput', function($rootScope, $eventsCommon, $timeout, $q, typeRefService, partialLookup, $modal, clientConstants) {
    return {
      restrict: 'C',
      template: '<div ng-include="getContentUrl()"></div>',
      scope: {
        directiveData: '=',
        key: '@',
        required: '@'
      },
      controller: function($rootScope, $scope, $translate, defaultSettings, settingsInstances, clientConstants) {

        var addTitles = function(data) {
          if (data) {
            for (i = 0; i < data.length; i++) {
              if (!data[i].title && data[i].name) {
                data[i].title = data[i].name;
              }
            }
          }

          return data;
        };
        var setPlaceholder = function(translatedTitle) {
          $translate('OPTIONAL_FIELD_LABEL').then(function(label) {
            if (clientConstants.forms && clientConstants.forms.showOptionalLabels && !$scope.directiveData.required) {
              $scope.directiveData.ui.placeholder = translatedTitle + label;
            } else {
              $scope.directiveData.ui.placeholder = translatedTitle;
            }
          }).catch(function(error){
            $scope.directiveData.ui.placeholder = translatedTitle;
          });
        };

        $translate($scope.directiveData.ui.title).then(setPlaceholder);

        //allow front end to force required
        if ($scope.required) {
          $scope.directiveData.required = true;
        }

        if ($scope.directiveData.typeRef) {
          if (!$scope.directiveData.endPoint) {
            $scope.directiveData.endPoint = settingsInstances.getTypeRefsInstance('default');
          }
          var endPointData = $scope.directiveData.endPoint,
            typeRef = $scope.directiveData.typeRef;

          if (endPointData[typeRef]) {

            //this $translate can probably be removed pending some testing
            // $translate($scope.directiveData.ui.title).then(function (translatedTitle) {

            $scope.translatedTitle = $translate.instant($scope.directiveData.ui.title);
            $scope.objectRef = $scope.translatedTitle.toLowerCase();
            var setTypeRefData = function(data) {
              if (endPointData[typeRef].canPost) {
                //create an initial data element for create new, be sure to always concat results to this.
                var initialData = [{
                  _id: -1,
                  title: "Create New " + $scope.translatedTitle,
                  description: null,
                  action: 'createNew',
                  groupBy: ""
                }];
                $scope.directiveData.ui.data = initialData.concat(addTitles(data));
              } else {
                $scope.directiveData.ui.data = data;
              }
            };
            //set endpoint in case we need to call on it elsewhere
            var endPoint = endPointData[typeRef].url;
            //NON-ASYNC
            typeRefService.getTypeRef(endPoint).then(function(response) {
              setTypeRefData(response.results);
            });

            //ASYNC
            $scope.getLocation = function(val) {
              //add an initial data element for create new
              var data = {};
              data.title = "/" + val + ".*/";
              typeRefService.getTypeRef(endPoint, data).then(function(response) {
                setTypeRefData(response.results);
              });
            };

            // }); //end $translate
          } else {
            $scope.directiveData.ui.type = 'string';
          }

        }
        $scope.directiveData.ui.type = defaultSettings.forms.elementTypes[$scope.directiveData.type];
        if ($scope.directiveData.type == 'geo' || $scope.key == 'useCurrentLocation') {
          $rootScope.$on('maps.setCoords', function(e, data) {
            if ($scope.key == 'useCurrentLocation' && data.reset == true) {
              $scope.directiveData.answer = 'false';
            }
            if ($scope.directiveData.type == 'geo') {
              $scope.directiveData.answer = [data.lat, data.lng];
            }
          });
        }
        $scope.open = function(){
          $timeout(function(){
            $scope.directiveData.opened = !$scope.directiveData.opened;
            $scope.directiveData = $scope.directiveData;
          });
        }
      },
      link: function(scope, element, attrs) {

        var endPointData = scope.directiveData.endPoint,
          typeRef = scope.directiveData.typeRef;

        scope.getContentUrl = function() {
          if (scope.directiveData.ui.type) {
            return clientConstants.partialsBaseLocation + '/fragments/' + scope.directiveData.ui.type.toLowerCase() + '.html';
          } else {
            return "";
          }
        }
        scope.addArrayItem = function() {
          scope.directiveData.answer.push("");
        }
        scope.removeArrayItem = function(index) {
          scope.directiveData.answer.splice(index, 1);
        }
        scope.booleanChange = function(data) {
          if (scope.key == 'useCurrentLocation') {
            $rootScope.$emit('maps.useCurrent', {
              useCurrent: data
            });
          }
        }
        scope.checkSelection = function(item, model, index) {
          if (item.action && endPointData[typeRef].canPost) {
            scope[item.action](index);
          }
        };

        scope.createNew = function(index) {

          var partialString = scope.objectRef,
            skope = $rootScope.$new(),
            arrayIndex = index;

          scope.$parent.actionableForm.$invalid = true;

          if (partialLookup[scope.objectRef]) {
            partialString = partialLookup[scope.objectRef];
          }
          skope.abort = function() {
            modalInstance.dismiss();
          };
          skope.changeState = function(state, query, newItem) {
            //ignore state and query here, this is just a a spoof to get what we need and avoid a goofy error
            if (newItem) {
              typeRefService.getTypeRef($scope.directiveData.endPoint[$scope.directiveData.typeRef], {}).then(function(response) {
                setTypeRefData(response.results);
                if (arrayIndex && arrayIndex != null) {
                  scope.directiveData.answer[arrayIndex] = newItem.title; //DON'T KNOW IF THIS WORKS
                } else {
                  scope.directiveData.answer = newItem;
                }
                modalInstance.close();
              });
            } else {
              skope.abort();
            }
          }

          var modalInstance = $modal.open({
            size: "lg",
            templateUrl: 'partials/crud/' + partialString + '/POST.html',
            controller: partialString + 'POSTController',
            scope: skope
          });
        };
      }
    }
  });