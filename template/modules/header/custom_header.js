angular.module('<%=appname%>')
  .directive('customHeader', function($compile) {
      return{
          restrict: 'C',
          replace: true,
          transclude: true,
          require: '^?scidHeader',
          templateUrl: "./modules/header/customHeaderBlock.html",
          link: function(scope, element, attrs, scidHeaderController) {
            scope.header = {
                links: [
                {
                  "name": "link 6"
                },
                {
                  "name": "link 7"
                },
                {
                  "name": "link 8"
                },
                {
                  "name": "link 9"
                },
                {
                  "name": "link 10"
                }
                ]
            }
          }
      }
  })