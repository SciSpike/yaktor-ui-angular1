angular.module('googleMaps')
  .directive('mapsDirective', ['$rootScope', 'routesExtended', function($rootScope, routesExtended) {
    return{
            restrict: 'C',
            transclude: true,
            templateUrl : function($node, tattrs) {
              return partialsBaseLocation + "/googleMap/googleMap.html"
            },
            scope:{
              directiveData: '='
            },
            controller: routesExtended.routes['googleMaps.index'] || 'googleMapsCtrl',
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
  }]);