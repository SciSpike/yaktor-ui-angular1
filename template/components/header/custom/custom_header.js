angular.module('<%=appname%>')
  .directive('customHeader', function($compile) {
      return{
          restrict: 'C',
          transclude: true,
          require: '^?scidHeader',
          templateUrl: "./components/header/custom/customHeaderBlock.html",
          link: function(scope, element, attrs, scidHeaderController, $translate, $filter) {
            
          }
      }
  });