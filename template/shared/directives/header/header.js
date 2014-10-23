angular.module('views')
  .directive('engineUiHeader', function($compile) {
      return{
          restrict: 'C',
          transclude: true,
          templateUrl : function($node, tattrs) {
              return partialsBaseLocation + "/header/headerBlock.html"
            },
          controller: "headerCtrl"
      }
  });