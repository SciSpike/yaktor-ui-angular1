angular.module('views')
  .controller('headerCtrl', ["$scope",'$modal', 'RestService',  function ($scope,$modal, RestService) {
    $scope.open = function(templateUrl,controller,resolve){
      $modal.open({
        templateUrl: templateUrl,
        backdrop: true,
        controller: controller,
        resolve: resolve
      });
    }
    $scope.auth={};
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
              $http.defaults.headers.common.authorization = 'Bearer '+data.access_token;
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