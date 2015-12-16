'use strict';

angular.module('<%=appname%>')
  .factory('serverLocation', ['$q', 'clientConstants', function($q, clientConstants){
    
    var _isServerLocal = function(){
      if (window.app && window.app.isCordova){
        return false
      }else{
        return true
      }
        
    };
    
    var _getMainServer = function(){
      var defer = $q.defer();
      var isLocal = _isServerLocal();
      var server = window.location.origin;
      
      if (isLocal) {
        defer.resolve(server);
      } else {
        if (clientConstants.servers && clientConstants.servers.main) {
          server = clientConstants.servers.main;
          defer.resolve(server);
        }else{
          defer.reject("server unknown");
        }
      }
      
      return defer.promise 
    };
    
    return {
      getMainServer: _getMainServer
    }
  
  }]);