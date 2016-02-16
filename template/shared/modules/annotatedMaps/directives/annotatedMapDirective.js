angular.module('annotatedMaps')
	.directive('annotatedMapsDirective', function(clientConstants) {
		return{
			restrict: 'C',
			transclude: true,
			templateUrl : function() {
				return clientConstants.partialsBaseLocation + "/annotatedMaps/annotatedMaps.html"
			},
			controller: 'annotatedMapsCtrl'
		}
	})