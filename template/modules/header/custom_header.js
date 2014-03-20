angular.module('<%=appname%>')
  .directive('customHeader', function($compile) {
      return{
          restrict: 'C',
          transclude: true,
          require: '^?scidHeader',
          templateUrl: "./modules/header/customHeaderBlock.html",
          link: function(scope, element, attrs, scidHeaderController) {
            scope.header = {
                links: [
                  {
                    "title": "{{'_BILL.DELETE.RECUR.INTERVAL' | translate}}",
                    "name": "contact"
                  },
                  {
                    "title": "more",
                    "name": "more"
                  }
                ]
            }
          }
      }
  })