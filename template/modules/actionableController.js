angular.module('<%- moduleName %>')
  .controller('<%- moduleName %><%- state.name %>Controller',
		  ['$rootScope','$scope','$state','$stateParams','$location', 'RestService', 'SocketService',
		   function ($rootScope,$scope,$state,$stateParams,$location, RestService, SocketService) {
			  <%var directiveData = {};
			  var createDirectives = function(dataObject, elements){
			  	for(element in elements){
			  		if(elements[element].components){
			  			dataObject[element] = {};
			  			createDirectives(dataObject[element], elements[element].components.elements);
			  		}else{
			  			var elementData = elements[element];
			  			dataObject[element] = elementData;
			  			dataObject[element]['answer'] = '';
			  		}	
			  	}%>
			  <%}
			  createDirectives(directiveData, state.components.elements);%>
			  
			  $scope.directiveData = <%= JSON.stringify(directiveData,null,2)%>;
			  
			  $scope.getData = function(nestedArray){
			    console.log(nestedArray);
			  }
			  
			  var answers = {};
			  function returnAnswers(dataObject, answersObject, prevObject, prevKey){
          switch(dataObject.constructor.name.toLowerCase()) {
            case 'array':
              for(var i=0; i<dataObject.length; i++){
                answersObject[i] = {};
                returnAnswers(dataObject[i], answersObject[i], answersObject, key);
              }
              break;
          }
          for(key in dataObject){
            if(dataObject[key]){
              if(dataObject[key].answer){
                if(dataObject[key].typeRef){
                  dataObject[key].answer = dataObject[key].answer._id;
                }
                if(dataObject[key].answer != ''){
                  answersObject[key] = dataObject[key].answer;
                }else{
                  delete answersObject[key]; 
                }
              }else{
                switch(dataObject[key].constructor.name.toLowerCase()) {
                case 'array':
                  answersObject[key] = [];
                  returnAnswers(dataObject[key], answersObject[key], answersObject, key);
                  break;
                case 'object':
                  if(key != 'ui'){
                    answersObject[key] = {};
                    returnAnswers(dataObject[key], answersObject[key], answersObject, key);
                  }
                  break;
                default:
                  if(prevObject && prevObject[prevKey]){
                    delete prevObject[prevKey];
                  }
                  break;
              }
              }
            }
          }
          return answers;
        }
        function cleanData(answerObject){
          for(key in answerObject){
              if(answerObject[key].constructor.name.toLowerCase() == 'object'){
                if($.isEmptyObject(answerObject[key])){
                  delete answerObject[key]; 
                }else{
                  cleanData(answerObject[key]);
                }
              }
          }
          return answerObject
       }
$scope.submitForm = function(type){
	var data = returnAnswers($scope.directiveData, answers);
	data = cleanData(data);
	type = type.replace('_', '').toLowerCase();
	if(type == 'init'){
		$scope.init<%- moduleName %>Conversation(data);
	}else{
		var conversation = 'on_' + type.replace(/\./g,'');
		console.log(conversation);
		$scope[conversation](data);
	}
}		  
}]);