angular.module('views')
.factory('SiteService', ['$interval', '$rootScope', '$q', '$http', 'serverLocation', 
    function($interval, $rootScope, $q, $http, serverLocation) {

      var _getIndividual = function() {
        var deferGet = $q.defer();
        serverLocation.getMainServer().then(function(serverLocation){
          $http.get(serverLocation + '/me')
            .success(function(data, status, headers, config) {
              console.log(data, status, headers, config);
              deferGet.resolve(data);
            })
            .error(function(data, status, headers, config) {
              console.log("ERROR:", data, status, headers, config);
              deferGet.reject(data);
          });
        });
        return deferGet.promise;
      };

      return {
        getIndividual: _getIndividual
      }
}]);
