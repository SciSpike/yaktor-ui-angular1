
'use strict';

angular.module('{{appname}}').service('RestService', function (serverLocation, $http) {
  
  var service = {};
  
  service.POST = function(endpoint, data) {
    console.log('service.POST', data);
    
    $http.post(serverLocation + endpoint, data)
      .success(function(data, status, headers, config) {
        console.log(data, status, headers, config);
      })
      .error(function(data, status, headers, config) {
        console.log("ERROR:", data, status, headers, config);
      });
  }
  
  service.GET = function(endpoint, data) {
    console.log('service.GET', data);
  }
  
  service.FIND = function(endpoint, data) {
    console.log('service.FIND', data);
  }
  
  service.PUT = function(endpoint, data) {
    console.log('service.PUT', data);
  }
  
  return service;
});