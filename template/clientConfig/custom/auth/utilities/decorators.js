angular.module("views")
  .config(['$provide',
    function($provide) {
      $provide.decorator('$rootScope', function($delegate) {
        $delegate.auth = {};

      
        return $delegate;
      });
    }
  ])