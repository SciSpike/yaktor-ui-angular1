angular.module('googleMaps')
  .factory('googleMapService', ['$q', '$timeout', function($q, $timeout){
      
      var _getAddressCoords = function(address){
        var pos = $q.defer();
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({ 'address': address}, function (results, status) {
          if(status == 'ZERO_RESULTS'){
            pos.reject();
          }
          if (status == google.maps.GeocoderStatus.OK) {
              var lat = results[0].geometry.location.lat();
              var lng = results[0].geometry.location.lng();
              pos.resolve({
                pos: new google.maps.LatLng(lat, lng),
                lat: lat,
                lng: lng
              });
          } else {
            pos.reject();
          }
        });
        return pos.promise;
      }
      
      var _getCurrentLocationCoords = function(){
        var pos = $q.defer();
        if(navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            pos.resolve({
              pos: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
              lat: position.coords.latitude,
              lng: position.coords.longitude
            });
          }, function() {
            pos.reject();
          });
        }else{
          pos.reject();
        }
        return pos.promise;
      }
      
      return {
        getAddressCoords: _getAddressCoords,
        getCurrentLocationCoords: _getCurrentLocationCoords
      }
      
  }]);