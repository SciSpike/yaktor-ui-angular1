(function() {
  'use strict';
  
  angular.module('{{appname}}', ['ui.router'])
    .config(function($stateProvider, $urlRouterProvider, $locationProvider) {
      $locationProvider.html5Mode(true);
      
      $stateProvider
        
        {{#states}}
        .state('{{name}}', {
          url: '/{{url}}',
          templateUrl: 'partial/{{url}}.html',
          controller: function($scope, SocketService) {
            
            $scope.$on('$stateChangeStart', function(e, toState, toParams, fromState, fromParams) {
              
              // TODO: Use the SocketService to push events with data to the server
              console.log($scope.data);
            });
            
          }
        })
        {{/states}}
      
    });
    
})();