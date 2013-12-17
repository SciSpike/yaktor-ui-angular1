'use strict';

angular.module('{{appname}}').controller('MainCtrl', function ($scope) {
  
  // TODO: Setting the initial state will be done by a backend response
  $scope.state = '{{initialState}}';
  
  $scope.onStateChange = function(state) {
    console.log(state);
    $scope.state = state;
  };
  
});