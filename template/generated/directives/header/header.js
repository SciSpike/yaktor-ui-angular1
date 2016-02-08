angular.module('views')
  .directive('engineUiHeader', ['routesExtended', 'htmlExtended', 'clientConstants', function(routesExtended, htmlExtended, clientConstants) {
      return{
          restrict: 'C',
          transclude: true,
          templateUrl : function() {
            if(htmlExtended['header.index']){
              return htmlExtended['header.index'];
            }
            return clientConstants.partialsBaseLocation + "/header/headerBlock.html"
          },
          controller: routesExtended['header.index'] || "headerCtrl"
      }
  }]);