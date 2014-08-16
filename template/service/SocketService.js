'use strict';

angular.module('{{appname}}').service(
    'SocketService',
    function ($rootScope, $state, serverLocation, $sessionStorage, AuthService) {

      // // TODO: Create all socket connections here based on Jonathan's specs
      // 
      var service = {};
      // 
      // service.socket = new SockJS(serverLocation);
      // service.emitter = new Emitter();
      // 
      // service.onload = function(e) {
      // console.log('dummy onload function');
      // }
      service.init = function (sUrl, initData, autoReInit, cb) {
        var listeners = [];
        var agentApi = require(sUrl.replace(".", "/").substr(1));
        // Connect api short circuits if already connected
        var connection = require('socketApi').connectWithPrefix(serverLocation, sessionId, function (cb) {
          var token = null;
          try {
            AuthService.getAuthToken().then(function (objToken) {
              token = objToken.access_token;
              cb(null, token);
            });
          } catch (e) {
            console.log(e);
          }
        }, true, function () {
          for ( var onV in agentApi.socket.on) {
            (function (on) {
              if (/state:.*/.test(on)) {
                listeners.push(agentApi.socket.on[on](sessionId, initData, function (data) {
                  console.log("Going to: %s", on);
                  cb(null, "." + on, data);
                }));
              }
            })(onV);
          }
          agentApi.socket.emit.init(sessionId, initData);
        });
        if (autoReInit) {
          connection.on("connect", function () {
            agentApi.socket.emit.init(sessionId, initData);
          });
          var off = $rootScope.$on("$stateChangeStart",function(){
            off();
            connection.removeAllListeners();
            listeners.forEach(function(off){
              off();
            });
          });
        }
      }
      service.doAction = function (sUrl, action, initData, data, cb) {
        require(sUrl.replace(/:state.*/, "").replace(".", "/").substr(1)).socket.emit[action](sessionId, initData,
            data || {});
      }

      return service;
    });