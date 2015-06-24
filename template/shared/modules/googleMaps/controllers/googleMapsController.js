angular.module('googleMaps')
	.controller('googleMapsCtrl', ['$rootScope', '$scope','$filter', '$state', '$state', 'googleMapService', function ($rootScope, $scope, $filter, $state, $state, googleMapService) {
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
		$scope.directiveData = {
			useCurrent: true
		};

		$scope.$watch('addressArray', function(newValue, oldValue){
			if(newValue){
				for(var i=0; i<newValue.length; i++){
					if(newValue[i].answer != null && newValue[i].answer != "" && newValue[i].answer != undefined){
						$scope.directiveData.useCurrent = false;
					}
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
	}]);