(function() {
  'use strict';
  
  angular.module('{{appname}}', ['ui.bootstrap', 'ui.router'])
    .config(function($stateProvider, $locationProvider) {
      
      $stateProvider
        
        {{#states}}
        .state('{{name}}', {
          url: '/{{url}}',
          templateUrl: 'partial/{{name}}.html',
          controller: '{{controller}}Ctrl'
        })
        {{#actionables}}
        .state('{{name}}.{{actionableName}}', {
          url: '/{{actionableName}}',
          templateUrl: 'partial/{{name}}.{{actionableName}}.html'
        })
        {{/actionables}}
        {{/states}}
      
    });

})();