angular.module('<%=appname%>')
  .directive('navPanel', function($compile) {
    return {
      restrict: 'C',
      templateUrl : function($node, tattrs) {
          return partialsBaseLocation + "/navPanel/navPanel.html"
        },
      controller: function($scope) {
        this.togglePanel = function() {
          $('.navPanel').toggleClass('panelOpen');
          $('.navPanel').toggleClass('panelClosed');
        };
        
        $scope.mainNavigation = [
          <% _.each(moduleNames.agents, function(moduleName, index) { %>
          {
            'title': '<%- moduleName %>',
            'link': 'main.<%- moduleName %>'
          },<%});%>
          <% _.each(moduleNames.crud, function(moduleName, index) { %>
          {
            'title': '<%- moduleName %>',
            'link': 'main.<%- moduleName %>.FIND'
          }<%if (index != moduleNames.crud.length - 1){%>,<%}});%>
        ];
      },
      link: function(scope, element, attrs, scidFooterController, $translate, $filter) {
      
      }
    }
  })
