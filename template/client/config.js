(function() {
  'use strict';
  require('angular');
  angular.module('clientConfig', [])
    .constant('clientConstants', {
      'partialsBaseLocation': 'generated/partials',
      'clientBaseLocation': 'client',
      'defaultLocale': "en_US",
      'forms': {
        "elementTypes": {

        },
        'showOptionalLabels': false,
        'showPatternExplanations': false
        
      },
      'refLookup': {

      },
      'security':{
        'useAuth': false
      },
      'grid':{
    	  'enabled': true,
    	  'showFilters': false,
    	  'numFilters': 0
      },
      'servers':{
        'main': 'http://localhost:3000'
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
