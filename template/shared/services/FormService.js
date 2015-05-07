angular.module('views')
  .factory('FormService', ['$rootScope', '$q', '$modal',
    function($rootScope, $q, $modal) {

      var _returnAnswers = function(dataObject, answersObject, prevObject, prevKey) {
        switch (dataObject.constructor.name.toLowerCase()) {
          case 'array':
            for (var i = 0; i < dataObject.length; i++) {
              answersObject[i] = {};
              _returnAnswers(dataObject[i], answersObject[i], answersObject, key);
            }
            break;
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
              switch (dataObject[key].constructor.name.toLowerCase()) {
                case 'array':
                  answersObject[key] = [];
                  _returnAnswers(dataObject[key], answersObject[key], answersObject, key);
                  break;
                case 'object':
                  if (key != 'ui') {
                    answersObject[key] = {};
                    _returnAnswers(dataObject[key], answersObject[key], answersObject, key);
                  }
                  break;
                default:
                  if (prevObject && prevObject[prevKey]) {
                    delete prevObject[prevKey];
                  }
                  break;
              }
            }
          }
        }
        return answersObject;
      };
      var _cleanData = function(answerObject) {
        for (key in answerObject) {
          if (answerObject[key].constructor.name.toLowerCase() == 'object') {
            if ($.isEmptyObject(answerObject[key])) {
              delete answerObject[key];
            } else {
              _cleanData(answerObject[key]);
            }
          }
        }
        return answerObject
      };

      return {
        returnAnswers: _returnAnswers,
        cleanData: _cleanData
      }
    }
  ]);
