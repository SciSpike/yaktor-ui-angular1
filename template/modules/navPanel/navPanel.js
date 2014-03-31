angular.module('<%=appname%>')
  .directive('navPanel', function($compile) {
      return{
          restrict: 'C',
          controller: function() {
            this.togglePanel = function(){
              $('.navPanel').toggleClass('panelOpen');
            }
          }
      }
  })