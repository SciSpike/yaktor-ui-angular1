angular.module('views')
	.directive('engineUiIntegerInput', function($rootScope, $eventsCommon, $timeout) {
		return{
	          restrict: 'C',
	          template: '<div ng-include="getContentUrl()"></div>',
	          scope: {
            	  directiveData: '='
	          },
	          controller: function($scope, $filter) {
	        	  
	          },
	          link: function(scope, attrs, element){
	        	  scope.getContentUrl = function() {
	                  return partialsBaseLocation + '/fragments/' + scope.directiveData.ui.type + '.html';
	             }
	          }
	      }
	});