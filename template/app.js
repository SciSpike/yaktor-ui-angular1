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
    .controller("ConnectionCtrl", function($scope, $http, $cookies) {
      $scope.isConnected = true;
      var host = "http://0.0.0.0:3000";
      
      $http.get(host)
        .success(function() {
          var sessionId = $cookies["connect.sid"].replace(/s:([^\.]*).*/, "$1");
          window.SodaPurchase.purchaser.socket.connectWithPrefix(host, sessionId, true, function() {
            $scope.isConnected = true;
          });
        })
        .error(function(data, status, headers, config) {
          $scope.isConnected = false;
        });
      
    });
    
    // console.log(window.SodaPurchase.purchaser.socket.connectWithPrefix);
    // window.SodaPurchase.purchaser.socket.connectWithPrefix("http://0.0.0.0:3000/", )
    
})();