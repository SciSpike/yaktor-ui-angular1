(function() {
  'use strict';
  require('angular');
  angular.module('sharedModule', [])
    .constant('clientConstants', {
      "forms": {
        "elementTypes": {

        }
      },
      'refLookup': {

      }
    })
    .provider('routesExtended', function() {
      return {
        routes: {
          'login.POST': 'loginPOSTExtended'
        },
        $get: function() {
          var routes = this.routes;
		  return routes;
        }
      }
    })
    .provider('htmlExtended', function() {
      return {
        views: {

        },
        $get: function() {
          var views = this.views;
		  return views;
        }
      }
    })
    .provider('partialLookup', function() {
      return {
        partials: {
        	roles: 'role'
        },
        $get: function() {
          var partials = this.partials;
		  return partials;
        }
      }
    })
    .factory('navPanelCustom', function() {
      var _navs = {
        'main': null
      };

      return {
        navs: _navs
      }
    });

})();
