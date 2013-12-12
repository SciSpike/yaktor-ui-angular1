'use strict';

angular.module('{{appname}}').controller('MainCtrl', function ($scope) {
  
  $scope.state = '{{initialState}}';
  
  $scope.onState = function(state) {
    $scope.state = state;
  };
  
});