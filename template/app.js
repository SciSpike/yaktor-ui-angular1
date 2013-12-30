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
            console.log("FROM STATE CONTROLLER", SocketService);
            SocketService.onload();
            
            $scope.$on('$stateChangeStart', function(e, toState, toParams, fromState, fromParams) {
              console.log($scope.data);
            });
            
          }
        })
        {{/states}}
      
    });
    
})();