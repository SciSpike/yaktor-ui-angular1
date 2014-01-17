(function() {
  'use strict';
  
  angular.module('{{appname}}', ['ngCookies', 'ui.bootstrap', 'ui.router'])
    .config(function($stateProvider, $urlRouterProvider, $locationProvider) {
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
    
  angular.module('{{appname}}')
    .run(function($http, $cookies) {
      $http.get("http://0.0.0.0:3000/")
        .success(function() {
          var sessionId = $cookies["connect.sid"].replace(/s:([^\.]*).*/, "$1");
          
          window.SodaPurchase.purchaser.socket.connectWithPrefix("http://0.0.0.0:3000", sessionId, true, function() {
            console.log('connected');
            console.log(arguments);
          });
          
      });
    
    });
    
    // console.log(window.SodaPurchase.purchaser.socket.connectWithPrefix);
    // window.SodaPurchase.purchaser.socket.connectWithPrefix("http://0.0.0.0:3000/", )
    
})();