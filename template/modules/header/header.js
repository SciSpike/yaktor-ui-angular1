angular.module('<%=appname%>')
  .directive('scidHeader', function($compile) {
      return{
          restrict: 'C',
          templateUrl: "./modules/header/headerBlock.html",
          controller: "headerCtrl"
      }
  })