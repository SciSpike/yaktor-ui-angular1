angular.module('<%=appname%>')
  .directive('customHeader', function($compile) {
      return{
          restrict: 'C',
          transclude: true,
          require: '^?scidHeader',
          templateUrl: "./modules/header/customHeaderBlock.html",
          link: function(scope, element, attrs, scidHeaderController, $translate, $filter) {
            
            //console.log($filter('translate')('_BILL.DELETE.RECUR.INTERVAL'));
            
            /*scope.$on('$translateChangeSuccess', function () {
              console.log('here');
              console.log($translate('_BILL.DELETE.RECUR.INTERVAL'));
            });*/
            
            scope.header = {
                links: [
                  {
                    "title": '_BILL',
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
  });