angular.module('views')
  .directive('engineUiHeader', ['routesExtended', 'htmlExtended', function(routesExtended, htmlExtended) {
      return{
          restrict: 'C',
          transclude: true,
          templateUrl : function() {
            if(htmlExtended['header.index']){
              return htmlExtended['header.index'];
            }
            return partialsBaseLocation + "/header/headerBlock.html"
          },
          controller: routesExtended['header.index'] || "headerCtrl"
      }
  }]);