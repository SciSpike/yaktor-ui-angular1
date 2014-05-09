angular.module('<%=appname%>')
  .directive('scidHeader', function($compile) {
      return{
          restrict: 'C',
          templateUrl: "./components/header/headerBlock.html",
          controller: "headerCtrl"
      }
  })