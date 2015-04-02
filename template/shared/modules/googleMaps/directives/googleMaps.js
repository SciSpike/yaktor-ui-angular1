angular.module('googleMaps')
  .directive('mapsDirective', function($rootScope, $eventsCommon, $timeout) {
    return{
            restrict: 'C',
            transclude: true,
            templateUrl : function($node, tattrs) {
              return partialsBaseLocation + "/googleMap/googleMap.html"
            },
            scope:{
              directiveData: '='
            },
            controller: function($scope, $filter, $state, $controller, googleMapService) {
              
              function buildAddress(addressObj){
                var address = [];
                for(key in addressObj){
                  if(key == 'address1' || key == 'address2' || key == 'city' || key == 'state' || key == 'zipCode'){
                    address.push(addressObj[key]);
                  }
                }
                return address;
              }
              
              $scope.addressArray;
              $scope.directiveData.useCurrent = true;
              
              $scope.$watch('addressArray', function(newValue, oldValue){
                for(var i=0; i<newValue.length; i++){
                  if(newValue[i].answer != null && newValue[i].answer != "" && newValue[i].answer != undefined){
                    $scope.directiveData.useCurrent = false;
                  }
                }
              }, true);
              
              function checkProperties(data){
                var address;
                for(key in data){
                  if(key == 'address'){
                    $scope.addressArray = buildAddress(data[key]);
                    
                  }
                  if(typeof data[key] == 'object'){
                    checkProperties(data[key]);
                  }
                }
              }
              
              checkProperties($scope.directiveData);
              
              $scope.map;
              $scope.mapOptions = {
                  zoom: 15
                };
              $scope.directiveData.mapLoaded = false;
              $scope.mapCleared = true;
              
              function useCurrentLocation() {
                googleMapService.getCurrentLocationCoords().then(function(response){
                  $scope.addressCoords = response;
                  $scope.mapDataReady = true;
                });
              }
              
              function useSetAddress(address){
                var testAddress = $.trim(address);
                var regex = new RegExp(",", "g");
                if(testAddress.replace(regex, '') != ''){
                  googleMapService.getAddressCoords(address).then(function(response){
                    $scope.addressCoords = response;
                    $scope.mapDataReady = true;
                  });
                }
              }
              
              $scope.searchAddress = function(){
                checkProperties($scope.directiveData);
                var addressString = '';
                for(var i=0; i<$scope.addressArray.length; i++){
                  if($scope.addressArray[i].answer != 'undefined'){
                    addressString = addressString + $scope.addressArray[i].answer + ',';
                  }
                }
                useSetAddress(addressString);
              }
              
              $rootScope.$on('maps.useCurrent', function (e, data) {
                if(data.useCurrent == true){
                  $scope.directiveData.useCurrent = true;
                  useCurrentLocation();
                }else{
                  $scope.directiveData.useCurrent = false;
                }
              });
              
            },
            link: function(scope, element, attrs){
              
              function setMap(pos, lat, lng){
                $rootScope.$emit('maps.setCoords', {lat:lat, lng:lng, reset: false});
                var infoMessage = lat + ', ' + lng;
                var infowindow = new google.maps.InfoWindow({
                  map: scope.map,
                  position: pos,
                  content: infoMessage
                });
                scope.map.setCenter(pos);
              }
              
              scope.$watch('mapDataReady', function(newValue, oldValue){
                if(newValue == true){
                  scope.mapCleared = false;
                  scope.directiveData.mapLoaded = true;
                  scope.map = new google.maps.Map($(element).find('#map-canvas')[0], scope.mapOptions);
                  setMap(scope.addressCoords.pos, scope.addressCoords.lat, scope.addressCoords.lng);
                  scope.mapDataReady = false;
                }
              });
              
              scope.clearMap = function(){
                scope.mapCleared = true;
                scope.mapDataReady = false;
                scope.directiveData.useCurrent = false;
                $rootScope.$emit('maps.setCoords', {lat:'', lng:'', reset: true});
                $($(element).find('#map-canvas')[0]).empty();
              }
              
            }
        }
  });