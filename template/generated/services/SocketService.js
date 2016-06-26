
'use strict';

angular.module('<%=appname%>').service(
  'SocketService',
    function ($rootScope, $state, serverLocation, $localStorage) {
    
    var eventEmitter = require("eventemitter2");
    var Promise = require('bluebird');
    var service = {};
    var instances = {};
    
    var ApiInstance = service.ApiInstance = function ApiInstance(client, agentName, sessionId, agentData) {
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

      this.onAny = function(cb){
        //Perhaps .onAny ???
        emitter.on(agentName + ":state:*:" + agentId, function (payload) {
          cb(null, this.event, payload);
        });
      };

      var init = this.init = function () {
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
    
    service.init = function (sUrl, initData, autoDisconnect) {
      if(instances[sUrl.replace(/:state.*/, "")+initData._id]){
        return Promise.reject(instances[sUrl.replace(/:state.*/, "")+initData._id]);
      }
      var authFunction = function(cb){
        var token = null;
        try {
          token = $localStorage.tokenStore.access_token;
        } catch(e){
          console.log(e);
        }
      
        cb(null,token);
      };
      return serverLocation.getMainServer().then(function(serverLocation){
        var config = {
          socketServiceUrl: serverLocation,
          authCall: authFunction,
          sessionId: sessionId,
          initData: initData,
          agentName: sUrl.replace("/","")
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
        return apiInstance;
      });
    };
    service.doAction = function (sUrl, action, initData, data, cb) {
      instances[sUrl.replace(/:state.*/, "")+initData._id][action](data, cb);
    };

    return service;
  });