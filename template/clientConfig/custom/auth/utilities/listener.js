angular.module("views")
.run(function($rootScope, $interval, $modal, $modalStack, $document, $state, $sessionStorage, $window, $filter, AuthService, SiteService, clientConstants){
  var activityEvents = 'mousemove keydown DOMMouseScroll mousewheel mousedown touchstart';
  var activityBody = $document.find('body');
  var activityInterval = null;
  var refreshInterval = null;
  var sessionCanceled = false;
  
  var changeState = function(state, data) {
    if(state){
      if (!data) {
        data = {};
      }
      $state.go(state, data, {
        location: true
      }).then(function() {});
    }
  };
  
  var activityListener = function(e) {
    console.log("active delay refresh");
    activityBody.off(activityEvents, activityListener);
    refreshInterval = $interval(function() {
      AuthService.isAuthenticated(true);
    }, 30 * 1000, 1);
  };
  var listenForActivity = function() {
    $interval.cancel(activityInterval);
    $interval.cancel(refreshInterval);
    activityInterval = $interval(function() {
      activityBody.on(activityEvents, activityListener);
    }, 30 * 1000, 1);
  };
  
  $rootScope.closeActiveModals = function() {
    $modalStack.dismissAll();
  }
  
  $rootScope.logout = function(s) {
    $sessionStorage.$reset();
    $window.location.href = $state.href('main.login.POST', {}, {absolute: true});
    $window.location.reload();
  };

  $rootScope.login = function() {
    changeState('main.login.POST', {}, {
      location: true
    });
  };
  
  $rootScope.$on("$idleCounter", function(){
    console.log("counting down");
    $rootScope.idleCounter = AuthService.getIdleCounter();
  });
  
  $rootScope.$on("$sessionCancelled", function(cancel){
    console.log("session cancelled = " + cancel);
    $rootScope.closeActiveModals();
    $rootScope.logout('sessionExpired');
    
  });
  
  $rootScope.$on('$inactive', function() {
    $rootScope.idleMax = AuthService.idleMax;
    
    if (!$rootScope.sessionCancelled) {
      $rootScope.warning = $modal.open({
        templateUrl: partialsBaseLocation + "/modals/warning-dialog.html",
        windowClass: 'modal-danger',
        resolve: {
          doAction: function() {
            return $rootScope.closeActiveModals;
          }
        },
        controller: function($scope,$rootScope, doAction, AuthService) {
          $scope.action = function() {
            doAction();
          };
          var setText = function(){
            $scope.text = $filter('translate')('_WARNING.IDLE', {
              value: AuthService.getIdleCounter()
            });
          };
          $scope.idleMax = AuthService.idleMax;
          $scope.displayProgression = true;
          $scope.title = $filter('translate')('_WARNING.TITLE');
          $scope.actionText = $filter('translate')('_CONTINUE');
        
          $rootScope.$on("$idleCounter", function(){
            console.log("counting down");
            setText();
          });
        }
      });

      var done = function() {
        // $interval.cancel($rootScope.counter);
        $rootScope.$broadcast("$active");
      };
      $rootScope.warning.result.then(done, done);
    }

  });
  

  $rootScope.postAuth = function(authenticated, event, toState, toParams, fromState, fromParams) {
    if(!$rootScope.auth){
      $rootScope.auth = {};
    }
    if (!authenticated) {
      $rootScope.auth.access_token = false;
      var attemptedState = toState ? toState : $state.current;
      if (attemptedState && attemptedState.name.match(/^main.resetPassword\.POST/)) {
        //do nothing
      } else {
        // if you are not logged in and you are going to login lets remember where you were
        if (event && toState.name == 'main.login.POST') {
          if (fromState && !fromState.name.match(/^(main\.resetPassword\.POST)|(main\.login\.POST)/)) {
            $rootScope.redir = fromState.name;
            $rootScope.redirParams = fromParams;
          }
          AuthService.isAuthenticated().then(function(authenticated) {
            event.preventDefault();
            if ($rootScope.redir) {
              changeState($rootScope.redir, $rootScope.redirParams);
              $rootScope.redir = null;
              $rootScope.redirParams = null;
            }
            else {
              changeState('main.home');
            }
          });
        } else {
        // just carry on for now
        }
      }
    } else {
      
      $rootScope.auth.access_token = true;
        SiteService.getIndividual().then(function(individual) {
          $rootScope.individual = individual;
          if (event && toState.name == 'main.login.POST') {
            event.preventDefault();
            changeState($rootScope.redir || $rootScope.home, $rootScope.redirParams);
          }
        });
    }
  };

  $rootScope.$on("$auth.refresh", listenForActivity);
  $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
    $rootScope.closeActiveModals();
    if (clientConstants.security.useAuth){
      AuthService.isAuthenticated(true, toState, fromState).then(function(authenticated) {
        $rootScope.postAuth(authenticated, event, toState, toParams, fromState, fromParams);
      });
    }
  });
  
  if (clientConstants.security.useAuth){
    listenForActivity();
    AuthService.isAuthenticated(true).then(function(authenticated) {
      $rootScope.postAuth(authenticated);
    });
  }  
  
})
