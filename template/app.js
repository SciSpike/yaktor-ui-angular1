(function() {
  'use strict';
  
  angular.module('{{appname}}', ['ngCookies', 'ui.bootstrap', 'ui.router'])
    .config(function($stateProvider, $locationProvider) {
      $locationProvider.html5Mode(true);
      
      $stateProvider
        
        {{#states}}
        .state('{{name}}', {
          url: '/{{url}}',
          templateUrl: 'partial/{{url}}.html',
          controller: '{{controller}}Ctrl'
        })
        {{/states}}
      
    });

})();