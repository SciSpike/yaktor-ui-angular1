angular.module('views')
	.directive('engineUiTextInput', function($rootScope, $eventsCommon, $timeout) {
		return{
	          restrict: 'C',
	          template: '<div ng-include="getContentUrl()"></div>',
	          scope: {
            	  directiveData: '='
	          },
	          controller: function($scope, $filter, clientSettings) {
	        	  $scope.directiveData.ui.type = clientSettings.forms.elementTypes[$scope.directiveData.type];
	          },
	          link: function(scope, attrs, element){
	        	  console.log(scope.directiveData);
	        	  scope.getContentUrl = function() {
	                  return partialsBaseLocation + '/fragments/' + scope.directiveData.ui.type + '.html';
	             }
	          }
	      }
	});