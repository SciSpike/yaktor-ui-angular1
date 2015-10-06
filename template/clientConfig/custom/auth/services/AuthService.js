var emitter = require('emitter-component');
var $ = require('$');
angular.module('views').factory('AuthService', ['$rootScope', '$interval', '$browser', '$q', '$sessionStorage', '$window', function ($rootScope, $interval, $browser, $q, $sessionStorage, $window) {
  var _authenticated = false;
  var _refreshing = false;
  var authEmitter = new emitter();
  
  var doTokenTimer = null;
  var countDownTimer = null;
  var _idleMax = 120;
  var _idleCounter = 0;
  var _sessionCancelled = false;
  
  var _getIdleCounter = function(){
    return _idleCounter;
  };
  
  var startCountdown = function(){
    _idleMax = _idleCounter = 120;

    countDownTimer = $interval(function() {
      _idleCounter--;
      $rootScope.idleCounter = _idleCounter;
      $rootScope.$emit("$idleCounter", $rootScope.idleCounter);
      if (_idleCounter <= 0 && !_sessionCancelled) {
        _sessionCancelled = true;
        $rootScope.$emit("$sessionCancelled", _sessionCancelled);
        $interval.cancel(countDownTimer);
      }
    }, 1000, _idleMax);
  };
  
  var _doToken = function (result) {
    var now = new Date().getTime();
    var warning_time = 121000;
    var issued = new Date(result.issued).getTime();
    var expires_in = result.expires_in;
    var expires_time = issued + expires_in;
    var expires = new Date(expires_time);
    var popup_in = expires_time - now - warning_time;
    $interval.cancel(doTokenTimer);
    doTokenTimer = $interval(function () {
      $rootScope.$emit("$inactive", expires_time);
      startCountdown();
      var off = $rootScope.$on('$active', function () {
        off();
        console.log('$active', "refreshing");
        _isAuthenticated(true);
      });
    }, popup_in, 1);
  };

  authEmitter.on("token", _doToken);

  var _isAuthenticated = function (refresh, toState, fromState) {
    var deferAuth = $q.defer();
    // look for stored token, return true/false
    // console.log("checking authentication");

    _getAuthToken(refresh).then(function (result) {
      var now = new Date();
      var issued = new Date(result.issued).getTime();
      var expires_in = result.expires_in;
      var expires = new Date(issued + expires_in);

      // expired are we?
      if (expires < now) {
        //clearing storage because you are expired.
        $sessionStorage.$reset();
        deferAuth.resolve(false);
      } else if (result.access_token) {
        if (refresh) {
          _refreshAuthToken(toState, fromState).then(function (result) {
            deferAuth.resolve(true);
          }, function () {
            deferAuth.resolve(false);
          });
        } else {
          deferAuth.resolve(true);
        }
      } else {
        deferAuth.resolve(false);
      }
    }, function (error) {
      deferAuth.resolve(false);
    });

    return deferAuth.promise;
  };

  var _getAuthToken = function (orFail) {
    var deferGetToken = $q.defer();
    var objToken = {};

    if (_refreshing) {
      // listen for "new token"
      authEmitter.once("token", function (objToken) {
        deferGetToken.resolve(objToken);
      });
    } else {
      // TODO: date diff it, refresh it
      var token = require('qs').parse(location.hash.replace(/#.*#/, ""));
      if ($sessionStorage.careToken) {
        deferGetToken.resolve($sessionStorage.careToken);
      } else if (token.access_token) {
        $sessionStorage.careToken = token;
        deferGetToken.resolve($sessionStorage.careToken);

      } else if (orFail) {
        deferGetToken.reject();
      } else {
        authEmitter.once("token", function (objToken) {
          deferGetToken.resolve(objToken);
        });
      }
    }
    return deferGetToken.promise;
  };

  var _getRefresh = function () {
    var deferGetRefresh = $q.defer();

    _getAuthToken().then(function (response) {
      deferGetRefresh.resolve(response.refresh_token);
    });

    return deferGetRefresh.promise;
  };

  var _getAccess = function () {
    var deferGetAccess = $q.defer();

    _getAuthToken().then(function (response) {
      deferGetAccess.resolve(response.access_token);
    });

    return deferGetAccess.promise;
  };

  var _refreshAuthToken = function (toState, fromState) {
    var deferRefresh = $q.defer();
    if(_refreshing) {
      authEmitter.once("token", function(data){
        deferRefresh.resolve($sessionStorage.careToken);
      });
      return deferRefresh.promise;
    }
    if ($sessionStorage.careToken){
      _refreshing = true;
      var data = {
        grant_type: "refresh_token",
        refresh_token: $sessionStorage.careToken.refresh_token,
        client_id: "0"
      };

      // Angular $http FAIL. $ WIN.
      // get a new token or die
      console.log("$$incOutstandingRequestCount");
      $browser.$$incOutstandingRequestCount();

      console.log(JSON.stringify(data));
      var funTimes = 1;
      var fun = function () {
        var def = {
          type: "POST",
          headers: {
            "x-to-state": toState ? JSON.stringify(toState) : "unknown",
            "x-from-state": fromState ? JSON.stringify(fromState) : "unknown"
          },
          contentType: "application/json",
          data: JSON.stringify(data),
          success: function (data) {
            $sessionStorage.careToken = {};
            console.log(JSON.stringify(data));
            $sessionStorage.careToken.access_token = data.access_token;
            $sessionStorage.careToken.refresh_token = data.refresh_token;
            $sessionStorage.careToken.issued = data.issued;
            $sessionStorage.careToken.expires_in = data.expires_in;

            _refreshing = false;
            // emit "new token"
            authEmitter.emit("token", data);
            $rootScope.$emit("$auth.refresh");
            deferRefresh.resolve($sessionStorage.careToken);

            console.log("$$completeOutstandingRequest");
            $browser.$$completeOutstandingRequest(angular.noop);
          }
        };
        if (funTimes > 0) {
          def.timeout = 1000;
        }
        $.ajax('/auth/token', def).fail(function (jqXHR, status, error) {
          // do error type stuff;
          if (error == "timeout") {
            if (0 < funTimes--) {
              return fun();
            }
          }
          _refreshing = false;
          delete $sessionStorage.careToken;
          deferRefresh.reject({});
          console.log("$$completeOutstandingRequest");
          $browser.$$completeOutstandingRequest(angular.noop);
        });
      };
      fun();
    }else{
      deferRefresh.reject({});
    }
    return deferRefresh.promise;
  };

  var _setAuthToken = function (objToken) {
    console.log("inside SetAuth with " + JSON.stringify(objToken));
    var deferSetToken = $q.defer();

    if (objToken.access_token) {
      console.log("$window", $window);
      authEmitter.emit("token", objToken);
      $sessionStorage.careToken = objToken;
      _authenticated = true;
      $rootScope.auth = objToken;
      deferSetToken.resolve(objToken);
    } else {
      try {
        delete $sessionStorage.careToken;
        _authenticated = false;
        $rootScope.auth = objToken;
        deferSetToken.resolve(objToken);
      } catch (err) {
        console.log(err);
      }
    }
    return deferSetToken.promise;
  };

  return {
    authenticated: _authenticated,
    getAuthToken: _getAuthToken,
    isAuthenticated: _isAuthenticated,
    setAuthToken: _setAuthToken,
    getAccess: _getAccess,
    getRefresh: _getRefresh,
    getIdleCounter: _getIdleCounter,
    idleMax: _idleMax,
    idleCounter: _idleCounter,
    sessionCancelled: _sessionCancelled
  };
}]);