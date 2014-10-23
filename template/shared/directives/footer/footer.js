angular.module('views')
  .directive('engineUIFooter', function($compile) {
      return{
          restrict: 'C',
          transclude: true,
          templateUrl : function($node, tattrs) {
              return partialsBaseLocation + "/footer/footerBlock.html"
            },
          controller: function() {
            
          }
      }
  })