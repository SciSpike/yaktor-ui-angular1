(function() {
  'use strict';
  
  angular.module('{{appname}}', ['ui.router'])
    .config(function($stateProvider, $urlRouterProvider) {
      
      $stateProvider
        
        {{#states}}
        .state('{{name}}'), {
          url: '/{{url}}',
          templateUrl: 'partial/{{url}}.html'
        })
        {{/states}}
        
      });
      
    });
    
})();