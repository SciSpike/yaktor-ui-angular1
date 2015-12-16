angular.module('views')
  .factory('FormService', ['$rootScope', '$q', '$modal',
    function($rootScope, $q, $modal) {

      var _returnAnswers = function(dataObject, answersObject, prevObject, prevKey) {
        if(Array.isArray(dataObject)){
          for (var i = 0; i < dataObject.length; i++) {
            answersObject[i] = {};
            _returnAnswers(dataObject[i], answersObject[i], answersObject, key);
          }
        }
        for (key in dataObject) {
          if (dataObject[key]) {
            if (dataObject[key].answer) {
              if (dataObject[key].typeRef) {
                dataObject[key].answer = dataObject[key].answer;
              }
              if (dataObject[key].answer != '') {
                answersObject[key] = dataObject[key].answer;
              } else {
                delete answersObject[key];
              }
            } else {
              
              
              if(Array.isArray(dataObject[key])){
                answersObject[key] = [];
                _returnAnswers(dataObject[key], answersObject[key], answersObject, key);
              }else if(angular.isObject(dataObject[key])){
                  if (key != 'ui') {
                    answersObject[key] = {};
                    _returnAnswers(dataObject[key], answersObject[key], answersObject, key);
                  }
              }else{
                if (prevObject && prevObject[prevKey]) {
                  delete prevObject[prevKey];
                }
              }
            }
          }
        }
        return answersObject;
      };
      var _cleanData = function(answerObject) {
        for (key in answerObject) {
          if (angular.isObject(answerObject[key])) {
            if ($.isEmptyObject(answerObject[key])) {
              delete answerObject[key];
            } else {
              _cleanData(answerObject[key]);
            }
          }
        }
        return answerObject
      };
      var _mergeAnswers = function(dataObject, answersObject){
        if(Array.isArray(dataObject)){
          for(var i=0; i<dataObject.length; i++){
            _mergeAnswers(dataObject[i], answersObject[i]);
          }
        }
        
        for(key in dataObject){
          if(dataObject[key]){
            if(dataObject[key].answer || dataObject[key].answer == ''){
              if(answersObject && answersObject[key]) {
                dataObject[key].answer = answersObject[key];
              }else{
                dataObject[key].answer = '';
              }
            }else{
            	console.log(key);
            	console.log(dataObject);
            	console.log(answersObject);
              _mergeAnswers(dataObject[key], answersObject[key]);
            }
          }
        }
      };
      return {
        returnAnswers: _returnAnswers,
        cleanData: _cleanData,
        mergeAnswers: _mergeAnswers
      }
    }
  ]);
