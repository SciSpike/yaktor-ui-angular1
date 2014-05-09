angular.module('<%=appname%>')
  .directive('scidFooter', function($compile) {
      return{
          restrict: 'C',
          templateUrl: "./components/footer/footerBlock.html",
          controller: function() {
            
          }
      }
  })