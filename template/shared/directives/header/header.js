angular.module('views')
  .directive('engineUiHeader', function(htmlExtended) {
      return{
          restrict: 'C',
          transclude: true,
          templateUrl : function() {
			  if(htmlExtended['header.index']){
				  return htmlExtended['header.index'];
			  }
			  return partialsBaseLocation + "/header/headerBlock.html"
            },
          controller: "headerCtrl"
      }
  });