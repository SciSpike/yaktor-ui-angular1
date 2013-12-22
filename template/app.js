(function() {
  'use strict';
  
  angular.module('{{appname}}', ['ui.router'])
    .config(function($stateProvider, $urlRouterProvider) {
      
      $stateProvider
        
        {{#states}}
        .state('{{name}}'), {
          url: '/{{url}}',
          templateUrl: 'partials/{{url}}.html'
        })
        {{/states}}
        
      });
      
    });
    
})();