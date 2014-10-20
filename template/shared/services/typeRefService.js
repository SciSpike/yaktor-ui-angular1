angular.module('views')
  .factory('typeRefService', ['$q', '$timeout', 'RestService', function($q, $timeout, RestService){
      var _getTypeRef = function(typeRef){
        var response = $q.defer();
        $timeout(function(){
          RestService['FIND'](typeRef, {},{},function(err,data){
                  if(err){
                      console.log(err);
                  } else {
                   response.resolve(data);
                  }
            });
        });
        return response.promise;
      }
      return {
        getTypeRef: _getTypeRef
      }
  }]);