angular.module('<%=appname%>')
	.directive('ngTooltip', function($compile) {
	    return{
	        restrict: 'A',
	        replace: true,
	        link: function (scope, element, attrs) {
	    		console.log(scope.htmlTooltip);
	    		element.append($compile(scope.htmlTooltip)(scope));
	        }
	    }
	});