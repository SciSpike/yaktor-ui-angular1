angular.module('<%- moduleName %>')
  .controller('<%- moduleName %><%- state.name %>Controller',
      ['$rootScope','$scope','$state','$stateParams','$location', 'RestService', 'SocketService', 'FormService',
       function ($rootScope,$scope,$state,$stateParams,$location, RestService, SocketService, FormService) {
        <%var directiveData = {};
        // var createDirectives = function(dataObject, elements){
//           for(element in elements){
//             if(elements[element].components){
//               dataObject[element] = {};
//               createDirectives(dataObject[element], elements[element].components.elements);
//             }else{
//               var elementData = elements[element];
//               dataObject[element] = elementData;
//               dataObject[element]['answer'] = '';
//             }
//           }
//         }
          var createDirectives = function(dataObject, elements){
            for(element in elements){
              // console.log(JSON.stringify(elements));
              
              if(elements[element].type == 'array'){
                if(elements[element].components){
                  for(el in elements[element].components.elements){
                    elements[element].components.elements[el].answer = '';
                  }
                  dataObject[element] = [elements[element].components.elements];
                }else{
                  dataObject[element] = elements[element];
                  dataObject[element].answer = new Array(1);
                }
              }else{
                if(!elements[element].components){
                  dataObject[element] = elements[element];
                  dataObject[element].answer = '';
                }else{
                  dataObject[element] = {};
                  createDirectives(dataObject[element], elements[element].components.elements);
                }
              }
            }
          }
        createDirectives(directiveData, state.components.elements);%>
        

        $scope.directiveData = <%= JSON.stringify(directiveData,null,2)%>;
        if(!Object.keys($scope.directiveData).length && $scope.abort){
          $scope.abort();
        }
        $scope.getData = function(nestedArray){
          // console.log(nestedArray);
        }
        
        var answers = {};
        
      $scope.submitForm = function(type){
        var data = FormService.returnAnswers($scope.directiveData, answers);
        data = FormService.cleanData(data);
        type = type.replace('_', '').toLowerCase();
        if(type == 'init'){
          $scope.init<%- moduleName %>Conversation(data);
        }else{
          var conversation = 'on_' + type.replace(/\./g,'');
          // console.log(conversation);
          $scope[conversation](data);
        }
      }      
}]);