
'use strict';

angular.module('<%=appname%>').service('RestService', function (serverLocation, $http,$location) {

  var service = {};

  service.POST = function(endpoint, data) {
    return serverLocation.getMainServer().then(function(serverLocation){
      return $http.post(serverLocation + endpoint, data)
        .success(function(data, status, headers, config) {
          return data;
        })
        .error(function(data, status, headers, config) {
          return data;
        });
    });
  };

  service.FINDBYID = function(endpoint, id) {
    return serverLocation.getMainServer().then(function(serverLocation){
      return $http.get(serverLocation + endpoint+"/"+id)
        .success(function(data, status, headers, config) {
          return data;
        })
        .error(function(data, status, headers, config) {
          return data;
        });
    });
  };

  service.GET = function(endpoint, id) {
    $location.path(endpoint+"/PUT/"+id);
  };

  service.FIND = function(endpoint, data, page) {
    return serverLocation.getMainServer().then(function(serverLocation){
      if (data && !data.page) {
        data.page = page;
      }
      return $http.get(serverLocation + endpoint+"?"+$.param(data))
        .success(function(data, status, headers, config) {
          return data;
        })
        .error(function(data, status, headers, config) {
          return data;
        });
    });
  };

  service.PUT = function(endpoint, data, id) {
    return serverLocation.getMainServer().then(function(serverLocation){
      return $http.put(serverLocation + endpoint+"/"+id, data)
        .success(function(data, status, headers, config) {
          return data;
        })
        .error(function(data, status, headers, config) {
          return data;
        });
    });
  };

  service.DELETE = function(endpoint, id) {
    return serverLocation.getMainServer().then(function(serverLocation){
      return $http.delete(serverLocation + endpoint+"/"+id)
        .success(function(data, status, headers, config) {
          return data;
        })
        .error(function(data, status, headers, config) {
          return data;
        });
    });
  };

  service.getRefData = function(URL, attr){
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
  };


  return service;
});