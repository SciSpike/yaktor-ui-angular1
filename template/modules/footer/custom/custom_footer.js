angular.module('<%=appname%>')
  .directive('customFooter', function($compile) {
      return{
          restrict: 'C',
          transclude: true,
          require: '^?scidFooter',
          templateUrl: "./modules/footer/custom/footerTabs.html",
          link: function(scope, element, attrs, scidFooterController, $translate, $filter) {
            
          }
      }
  });