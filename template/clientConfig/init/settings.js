(function() {
  'use strict';
  require('angular');
  angular.module('sharedModule', []) 
    .constant('clientConstants', {
      'forms':{
        'elementTypes': {
          
        }
      }
    })
    .provider('routesExtended', function LocalizationProvider() {
        return {
            routes: {
               
            },
            $get: function() {
              var routes = this.routes;
            }
        }
      })
      .provider('htmlExtended', function() {
        return {
            views: {
               
            },
            $get: function() {
              var views = this.views;
            }
        }
      });
})();