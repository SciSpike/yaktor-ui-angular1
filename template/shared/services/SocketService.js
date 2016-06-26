
'use strict';

angular.module('<%=appname%>').service(
  'SocketService',
    function ($rootScope, $q, $state, AuthService, serverLocation) {
    
    var eventEmitter = require("eventemitter2");
    var Promise = require('bluebird');
    var ApiInstance = function ApiInstance(client, agentName, sessionId, agentData, cb) {
      agentName = agentName.replace("/", ".");
      var that = this;
      var defer = Promise.defer();
      this.$whenConnected = defer.promise;
      var emitter = new eventEmitter({
        wildcard: true,
        delimiter: ":"
      });
      var agentId = agentData._id;
      var agent = require(agentName.replace(".", "/"));

      this.connection = client;

      if (cb) {
        emitter.on(agentName + ":state:*:" + agentId, function (payload) {
          cb(null, this.event, payload);
        });
      }

      var init = function () {
        defer.resolve();
        client.subscribe(agentName + ":state:+:" + agentId, {
          qos: 1
        }, function (err, granted) {
          return err && console.log("sbubb", err, granted);
        });
      };

      var autoInitFn = function () {
        init();
      };
      if (client.connected) {
        init();
      }

      client.on("connect", autoInitFn);

      var deInit = this.$conclude = function () {
        client.unsubscribe(agentName + ":state:+:" + agentId, function (err, granted) {
          return err && console.log("unsbubb", err, granted);
        });
        client.removeListener("connect", autoInitFn);
        client.removeListener("message", clientMessageListener);
        emitter.removeAllListeners();
      };

      var clientMessageListener = function (topic, payload) {
        var body = JSON.parse(payload.toString());
        emitter.emit(topic, body);
      };
      client.on("message", clientMessageListener);

      /***
       * wire an on proxy with off;
       */
      this.on = function (state, fn) {
        var fqe = agentName + ":state:" + state + ":" + agentId;
        emitter.on(fqe, fn);
        var off = function () {
          emitter.off(fqe, fn);
        };
        return off;
      };
      this.off = function(state,fn){
        var fqe = agentName + ":state:" + state + ":" + agentId;
        emitter.off(fqe, fn);
      };
      this.once = function (state, fn) {
        var fqe = agentName + ":state:" + state + ":" + agentId;
        emitter.once(fqe, fn);
      };
      var emit = function (action, msg, cb) {
        client.publish(agentName + "::" + action, JSON.stringify(msg), {
          qos: 1
        }, function (err, packet) {
          if (err) console.log("pbubub", err, packet);
          return cb && cb(err);
        });
      };
      var action = function (action, data, cb) {
        emit(action, {
          agentData: agentData,
          data: data
        }, cb);
      };


      /***
       * normalizer
       */
      Object.keys(agent.stateMatrix).forEach(function (fqnState) {
        Object.keys(agent.stateMatrix[fqnState]).forEach(function (a) {
          if (!that[a]) {
            that[a] = function (data, cb) {
              action(a, data, cb);
            };
          }
        });
      });

    };

    var socketWrapper = function (config) {
      var socketServiceUrl = config.socketServiceUrl;
      var authCall = config.authCall;
      var sessionId = config.sessionId;
      var initData = config.initData;
      var client = require('socketApi').connectWithPrefix(socketServiceUrl, sessionId, authCall, true);
      var apiInstance = new ApiInstance(client, config.agentName, sessionId, initData, config.cb);
      return apiInstance;
    };
    
    var service = {};
    var instances = {};
    
    service.init = function (sUrl, initData, autoDisconnect, cb) {
      var deferred = $q.defer();
      var authFunction = function (cb,refresh) {
        var token = null;
        try {
          //if we have tried a bad token then we need to try to refresh...
          //perhaps we are dead now and shouldn't retry...
          if(refresh){
            console.log("((((((((((((((((((((%s))))))))))))))))))))",refresh)
          }
          AuthService.isAuthenticated(refresh).then(function(authenticated){
            AuthService.getAuthToken().then(function (objToken) {
              token = objToken.access_token;
              cb(null, token);
            });
          })
        } catch (e) {
          console.log(e);
        }
      };
      return serverLocation.getMainServer().then(function(serverLocation){
        var config = {
          socketServiceUrl: serverLocation,
          authCall: authFunction,
          sessionId: sessionId,
          initData: initData,
          agentName: sUrl.replace("/",""),
          cb: cb
        };
        var apiInstance = socketWrapper(config);
        instances[sUrl+initData._id]=apiInstance;
        if (autoDisconnect) {
          var off = $rootScope.$on("$stateChangeStart", function () {
            off();
            apiInstance.$conclude();
            delete instances[sUrl.replace(/:state.*/, "")+initData._id];
          });
        }
        deferred.resolve(apiInstance);
        return deferred.promise;
      });
    };
    service.doAction = function (sUrl, action, initData, data, cb) {
      instances[sUrl.replace(/:state.*/, "")+initData._id][action](data, cb);
    };

    return service;
  });