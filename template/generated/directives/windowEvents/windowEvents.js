angular.module('windowEvents', [])
	.directive('backButton', ['$window', function($window) {
		return{
			restrict: 'C',
			transclude: true,
			template: '<button class="btn btn-secondary" ng-transclude></button>',
			link: function(scope, element, attrs) {
				element.on('click', function() {
					$window.history.back();
				});
			}
		}
	}])
	.directive('setContainerHeights', function() {
		return{
			restrict: 'C',
			link: function(scope, element, attrs) {
				element.height($(window).height());
				$(window).bind("resize", function() {
					element.height($(window).height());
				});
			}
		}
	});