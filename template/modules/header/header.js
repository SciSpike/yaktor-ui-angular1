angular.module('<%=appname%>')
  .directive('scidHeader', function($compile) {
      return{
          restrict: 'C',
          transclude: true,
          templateUrl: "./modules/header/headerBlock.html",
          controller: function($scope) {
            this.header = {
                links: [
                {
                  "name": "link 1"
                },
                {
                  "name": "link 2"
                },
                {
                  "name": "link 3"
                },
                {
                  "name": "link 4"
                },
                {
                  "name": "link 5"
                }
                ]
            }
            $scope.header = this.header;
          }
      }
  })