angular.module('<%=appname%>')
  .directive('scidHeader', function($compile) {
      return{
          restrict: 'C',
          transclude: true,
          templateUrl: "./modules/header/headerBlock.html",
          controller: "headerCtrl"
      }
  })