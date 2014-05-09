angular.module('<%=appname%>')
  .controller('headerCtrl', ["$scope",'$modal', 'RestService',"localStorageService","$http",  function ($scope,$modal, RestService,localStorageService,$http) {
    $scope.open = function(templateUrl,controller,resolve){
      $modal.open({
        templateUrl: templateUrl,
        backdrop: true,
        controller: controller,
        resolve: resolve
      });
    }
    
    $scope.auth=localStorageService.get("auth")||{};
    var updateAuth = function(){
      if($scope.auth.access_token){
        $http.defaults.headers.common.authorization = 'Bearer '+$scope.auth.access_token;
      } else {
        delete $http.defaults.headers.common.authorization;
      }
    }
    updateAuth();
    $scope.logout=function(){
      $scope.auth={};
      localStorageService.remove('auth');
      updateAuth();
    }
    $scope.login=function(){
      $scope.open("partial/login.POST.html",function($scope,$modalInstance,$http,auth){
        var data = $scope.data={};
        data.POST={};
        $scope.onPOST = function(method) {
          var data = $scope.data.POST;
          data.grant_type = "password";
          data.client_id = "0";
          RestService[method]('/auth/token', data,null,function(err,data){
            if(err){
              //do error type stuff;
            } else {
              for(var a in data){
                auth[a]=data[a];
              }
              updateAuth();
              localStorageService.add('auth',JSON.stringify(auth));
              $modalInstance.dismiss('cancel');
            }
          });
        }
      },{
        auth:function(){
          return $scope.auth;
        }
      });
    }
}]);