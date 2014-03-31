angular.module('<%=appname%>')
  .directive('scidFooter', function($compile) {
      return{
          restrict: 'C',
          templateUrl: "./modules/footer/footerBlock.html",
          controller: function() {
            
          }
      }
  })