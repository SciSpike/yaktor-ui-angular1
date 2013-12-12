(function() {
  'use strict';
  
  angular.module('{{appname}}', ['ngRoute'])
    .config(function($routeProvider, $locationProvider) {
      $locationProvider.html5Mode(true);
      
      $routeProvider
        .when('/', {
          templateUrl: '/view/main.html',
          controller: 'MainCtrl'
        })
        .otherwise({
          redirectTo: '/'
        });
    });
    
})();