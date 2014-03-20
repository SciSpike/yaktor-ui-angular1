angular.module('<%=appname%>')
  .directive('scidHeader', function($compile,headerCtlr) {
      return{
          restrict: 'C',
          transclude: true,
          templateUrl: "./modules/header/headerBlock.html",
          controller: headerCtlr
      }
  })