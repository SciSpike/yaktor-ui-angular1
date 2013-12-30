
'use strict';

angular.module('{{appname}}').service('SocketService', function ($rootScope) {
  
  // TODO: Create all socket connections here based on Jonathan's specs
  
  var service = {};
  service.onload = function(e) {
    console.log('dummy onload function');
  }
  
  return service;
});