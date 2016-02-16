angular.module('views')
  .directive('engineUIFooter', function($compile, clientConstants) {
      return{
          restrict: 'C',
          transclude: true,
          templateUrl : function($node, tattrs) {
              return clientConstants.partialsBaseLocation + "/footer/footerBlock.html"
            },
          controller: function() {
            
          }
      }
  })