
'use strict';

angular.module('{{appname}}').service('RestService', function (serverLocation, $http,$location) {
  
  var service = {};
  
  service.POST = function(endpoint, data,notUsed,cb) {
    console.log('service.POST', data);
    
    $http.post(serverLocation + endpoint, data)
      .success(function(data, status, headers, config) {
        cb(null,data);
      })
      .error(function(data, status, headers, config) {
        console.log("ERROR:", data, status, headers, config);
      });
  }
  service.FINDBYID = function(endpoint,notUsed, id,cb) {
    $http.get(serverLocation + endpoint+"/"+id)
    .success(function(data, status, headers, config) {
      console.log(data, status, headers, config);
      cb(null,data, status, headers, config);
    })
    .error(function(data, status, headers, config) {
      console.log("ERROR:", data, status, headers, config);
      cb(new Error(status));
    });
  }
  service.GET = function(endpoint,notUsed, id,cb) {
    $location.path(endpoint+"/PUT/"+id);
  }
  
  service.FIND = function(endpoint, data,page,cb) {
    data.page=page;
    $http.get(serverLocation + endpoint, {params:data})
    .success(function(data, status, headers, config) {
      console.log(data, status, headers, config);
      cb(null,data, status, headers, config);
    })
    .error(function(data, status, headers, config) {
      console.log("ERROR:", data, status, headers, config);
    });
  }

  service.PUT = function(endpoint, data, id,cb) {
    $http.put(serverLocation + endpoint+"/"+id, data)
    .success(function(data, status, headers, config) {
      console.log(data, status, headers, config);
      cb(null,data, status, headers, config);
    })
    .error(function(data, status, headers, config) {
      console.log("ERROR:", data, status, headers, config);
    });
  }
  service.DELETE = function(endpoint, notUsed,id,cb) {
    $http.put(serverLocation + endpoint+"/"+id)
    .success(function(data, status, headers, config) {
      console.log(data, status, headers, config);
      cb(null,data, status, headers, config);
    })
    .error(function(data, status, headers, config) {
      console.log("ERROR:", data, status, headers, config);
    });
  }
  
  return service;
});