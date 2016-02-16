angular.module('annotatedMaps')
	.controller('annotatedMapsCtrl', ["$scope","SiteService",  function ($scope,SiteService) {

		SiteService.getServiceableLocations().then(function(response){
			$scope.serviceableLocations = response;
			console.log($scope.serviceableLocations);
		});

	}]);