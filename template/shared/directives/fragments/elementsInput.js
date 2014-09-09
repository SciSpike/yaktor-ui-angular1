angular.module('views')
	.directive('engineUiElementsInput', function($rootScope, $eventsCommon, $timeout) {
		return{
	          restrict: 'C',
	          template: '<div ng-include="getContentUrl()"></div>',
	          scope: {
            	  directiveData: '=',
            	  templateName: '='
	          },
	          controller: function($scope, $filter, clientSettings) {
	        	  $scope.directiveData.ui.type = clientSettings.forms.elementTypes[$scope.directiveData.type];
	          },
	          link: function(scope, attrs, element){
	        	  scope.getContentUrl = function() {
	                  return partialsBaseLocation + '/fragments/' + scope.templateName + '.html';
	             }
	          }
	      }
	});