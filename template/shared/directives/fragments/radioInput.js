angular.module('views')
	.directive('engineUiRadioInput', function($rootScope, $eventsCommon, $timeout) {
		return{
	          restrict: 'C',
	          template: '<div ng-include="getContentUrl()"></div>',
	          scope: {
            	  directiveData: '=',
            	  templateName: '='
	          },
	          controller: function($scope, $filter) {
	        	  //AS THE DIRECTIVE DATA IS A SCOPE VARIABLE IN THE PARENT CONTROLLER HOPEFULLY WHEN WE UPDATE VALUES IT WILL UPDATE GLOBALLY
	        	  console.log($scope.directiveData);
	          },
	          link: function(scope, attrs, element){
	        	  scope.getContentUrl = function() {
	                  return partialsBaseLocation + '/fragments/' + scope.templateName + '.html';
	             }
	          }
	      }
	});