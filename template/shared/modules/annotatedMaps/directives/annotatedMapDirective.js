angular.module('annotatedMaps')
	.directive('annotatedMapsDirective', function() {
		return{
			restrict: 'C',
			transclude: true,
			templateUrl : function() {
				return partialsBaseLocation + "/annotatedMaps/annotatedMaps.html"
			},
			controller: 'annotatedMapsCtrl'
		}
	})