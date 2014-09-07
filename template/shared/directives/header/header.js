angular.module('<%=appname%>')
  .directive('scidHeader', function($compile) {
      return{
          restrict: 'C',
          templateUrl : function($node, tattrs) {
              return partialsBaseLocation + "/header/headerBlock.html"
            },
          controller: "headerCtrl"
      }
  });