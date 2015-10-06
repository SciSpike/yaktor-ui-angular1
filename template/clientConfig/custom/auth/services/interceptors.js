angular.module("views")
.factory('authHttpResponseInterceptor', ['$q', '$location', '$window', '$rootScope', 'AuthService', 'clientConstants',
  function($q, $location, $window, $rootScope, AuthService, clientConstants) {
    return {
      request: function(request) {
        var url = request.url;
        if (clientConstants.security.useAuth){
          if (/\/auth\/token/.test(url)) {
            return request;
          } else if (/\/auth\/register/.test(url)) {
            return request;
          } else if ((/\/partials\/crud\/client\/POST_Extended/.test(url))) {
            AuthService.isAuthenticated(true).then(function(authenticated){
              if (authenticated) {
                return request;
              }else{
                console.log("Not logged in", request);
                $rootScope.auth = null;
                var oldPath = $location.path();
                var oldSearch = $location.search()['redir'];
                if(oldSearch){
                  oldSearch = "?redir=" + oldSearch
                }else{
                  oldSearch = "";
                }
                $location.path('/login/POST').search('returnTo', oldPath + oldSearch);
                return request;
              }
            });
          } else if (/\/partials\//.test(url) && (!/\/partials\/crud\//.test(url))) {
            return request;
          } else if (/\/templates\//.test(url)) {
            return request;
          } else if (/\/auth\/reset\/request/.test(url)) {
            return request;
          } else if (/\/auth\/reset/.test(url)) {
            return request;
          }
          return AuthService.getAuthToken(true).then(function(token) {
            $rootScope.auth = token;
            request.headers.authorization = 'Bearer ' + token.access_token;
            return request;
          }, function() {
            return request
          });
         return request  
        }else{
          return request
        }
        
      },
      response: function(response) {
        if (response.status === 401) {
          console.log("Response 401");
        }
        return response || $q.when(response);
      },
      responseError: function(rejection) {
        if (clientConstants.security.useAuth){
          if (rejection.status === 401 && !/\/auth\/token/.test(rejection.config.url)) {
            return AuthService.isAuthenticated(true).then(function(authenticated) {
              if (authenticated) {
                return $q.reject(rejection);
              } else {
                console.log("Response Error 401", rejection);
                $rootScope.auth = null;
                //really should return replay(rejection.config.url,function(response){return response});
                var oldPath = $location.path();
                var oldSearch = $location.search()['redir'];
                if(oldSearch){
                  oldSearch = "?redir=" + oldSearch
                }else{
                  oldSearch = "";
                }
                $location.path('/login/POST').search('returnTo', oldPath + oldSearch);
                return $q.reject(rejection);
              }
            });
          } else {
            $rootScope.auth = null;
            return $q.reject(rejection);
          }
        }
      }
    }
  }
])

.config(['$httpProvider',
  function($httpProvider) {
    //Http Intercpetor to check auth failures for xhr requests
    $httpProvider.interceptors.push('authHttpResponseInterceptor');
  }
])
