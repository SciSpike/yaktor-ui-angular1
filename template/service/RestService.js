
'use strict';

angular.module('{{appname}}').service('RestService', function (serverLocation, $http) {
  
  var service = {};
  
  service.POST = function(data) {
    console.log('service.POST', data);
  }
  
  service.GET = function(data) {
    console.log('service.GET', data);
  }
  
  service.FIND = function(data) {
    console.log('service.FIND', data);
  }
  
  service.PUT = function(data) {
    console.log('service.PUT', data);
  }
  
  return service;
});