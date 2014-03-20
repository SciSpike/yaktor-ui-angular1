angular.module('<%=appname%>')
  .directive('scidHeader', function($compile) {
      return{
          restrict: 'C',
          require: '^ctrl1, ^ctrl2',
          templateUrl: "./modules/header/headerBlock.html",
          link: function (scope, element, attrs) {
            console.log(scope.test);
          }
      }
  })
  .controller('ctrl1', ['$scope', function($scope){
      $scope.test = 'test 1';
  }])
  .controller('ctrl2', ['$scope', function($scope){
      $scope.test = 'test 2';
  }]);