angular.module('<%=appname%>')
  .directive('scidFooter', function($compile) {
      return{
          restrict: 'C',
          templateUrl : function($node, tattrs) {
              return partialsBaseLocation + "/footer/footerBlock.html"
            },
          controller: function() {
            
          }
      }
  })