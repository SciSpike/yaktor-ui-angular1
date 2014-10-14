(function() {
  'use strict';
  require('angular');
  angular.module('sharedModule', [])    
    .provider('routesExtended', function LocalizationProvider() {
        return {
            routes: {
               
            },
            $get: function() {
              var routes = this.routes;
            }
        }
      });

})();