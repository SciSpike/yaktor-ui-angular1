angular.module('googleMaps')
	.controller('googleMapsExtended', ['$rootScope', '$scope','$controller', 'googleMapService', function ($rootScope, $scope, $controller, googleMapService) {

		angular.extend(this, $controller('googleMapsCtrl', {$scope: $scope}));

		window.initialize = function(data) {
			$scope.mapsReady = true;
			googleMapService.getCurrentLocationCoords().then(function(pos){
				 $scope.currentPosition = pos;
			});
		}

		var mapContainer = document.getElementById('googleMapsAPI');
		if(mapContainer.getElementsByTagName("script").length == 0 ){
			var script = document.createElement('script');
			script.type = 'text/javascript';
			script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&key=AIzaSyAxtErMIuqo7cr6h0PH8_ni9SlAnXEDmTo&callback=initialize';
			mapContainer.innerHTML = "";
			mapContainer.appendChild(script);
		}
	}]);