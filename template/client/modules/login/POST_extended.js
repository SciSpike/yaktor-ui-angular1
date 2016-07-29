angular.module('views')
  .controller('loginPOSTExtended', ['$rootScope', '$scope', '$state', '$stateParams', '$location', 'loginServices', '$controller',
    function($rootScope, $scope, $state, $stateParams, $location, loginServices, $controller) {

      angular.extend(this, $controller('loginPOSTController', {
        $scope: $scope
      }));

      var id = $stateParams.id;

      var answers = {};

      function returnAnswers(dataObject, answersObject) {
        switch (dataObject.constructor.name.toLowerCase()) {
          case 'array':
            for (var i = 0; i < dataObject.length; i++) {
              answersObject[i] = {};
              returnAnswers(dataObject[i], answersObject[i]);
            }
            break;
        }
        for (key in dataObject) {
          if (dataObject[key]) {
            if (dataObject[key].answer || dataObject[key].answer == '') {
              if (dataObject[key].typeRef) {
                dataObject[key].answer = dataObject[key].answer._id;
              }
              answersObject[key] = dataObject[key].answer;
            } else {
              switch (dataObject[key].constructor.name.toLowerCase()) {
                case 'array':
                  answersObject[key] = [];
                  returnAnswers(dataObject[key], answersObject[key]);
                  break;
                case 'object':
                  answersObject[key] = {};
                  returnAnswers(dataObject[key], answersObject[key]);
                  break;
              }
            }
          }
        }
        return answers;
      }
      $scope.submitForm = function(type) {
        var data = returnAnswers($scope.directiveData, answers);
        data.grant_type = "password";
        data.client_id = "0";
        loginServices.postlogin(data, id).then(function(response) {
          $scope.changeState('main.home', {
            id: 1
          });
        });
      }
    }
  ]);
