
'use strict';

angular.module('<%=appname%>').service('RestService', function (serverLocation, $http,$location) {
  
  var service = {};
  
  service.POST = function(endpoint, data,notUsed,cb) {
    serverLocation.getMainServer().then(function(url){
    $http.post(url + endpoint, data)
      .success(function(data, status, headers, config) {
        cb(null,data);
      })
      .error(function(data, status, headers, config) {
        console.log("ERROR:", data, status, headers, config);
        cb(data);
      });
    });
  }
  service.FINDBYID = function(endpoint,notUsed, id,cb) {
    serverLocation.getMainServer().then(function(url){
      $http.get(url + endpoint+"/"+id)
      .success(function(data, status, headers, config) {
        cb(null,data, status, headers, config);
      })
      .error(function(data, status, headers, config) {
        console.log("ERROR:", data, status, headers, config);
        cb(data);
      });
    });
  }
  service.GET = function(endpoint,notUsed, id,cb) {
    $location.path(endpoint+"/PUT/"+id);
  }
  
  service.FIND = function(endpoint, data,page,cb) {
    serverLocation.getMainServer().then(function(url){
      data.page=page;
      $http.get(url + endpoint+"?"+qs.stringify(data))
      .success(function(data, status, headers, config) {
        cb(null,data, status, headers, config);
      })
      .error(function(data, status, headers, config) {
        console.log("ERROR:", data, status, headers, config);
        cb(data);
      });
    });
  }

  service.PUT = function(endpoint, data, id,cb) {
    serverLocation.getMainServer().then(function(url){
      $http.put(url + endpoint+"/"+id, data)
      .success(function(data, status, headers, config) {
        cb(null,data, status, headers, config);
      })
      .error(function(data, status, headers, config) {
        console.log("ERROR:", data, status, headers, config);
        cb(data);
      });
    });
  }
  service.DELETE = function(endpoint, notUsed,id,cb) {
    serverLocation.getMainServer().then(function(url){
      $http.delete(url + endpoint+"/"+id)
      .success(function(data, status, headers, config) {
        cb(null,data, status, headers, config);
      })
      .error(function(data, status, headers, config) {
        console.log("ERROR:", data, status, headers, config);
        cb(data);
      });
    });
  }
  service.getRefData = function(URL,attr){
    var params = {};
    attr=attr||"id";
    return function(val) {
      params[attr]="/^"+val+"/";
      return $http.get(URL, {
        params: params
      }).then(function(res){
        return res.data.results;
      });
    };
  }
  
  
  return service;
});