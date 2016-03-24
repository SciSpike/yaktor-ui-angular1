angular.module('views')
  .factory('typeRefService', ['$q', '$timeout', 'RestService', function($q, $timeout, RestService){
      var _getTypeRef = function(typeRef, data){
        if(!data){
          data = {page:1};
        }
        return $q.when(RestService['FIND'](typeRef, data));

      }
      return {
        getTypeRef: _getTypeRef
      }
  }]);