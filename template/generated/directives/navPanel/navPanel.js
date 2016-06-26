//AGENT STUFF
 <%//used for extracting objects from the spec
 var objectFindByKey = function(array, key, value) {
    for (var i = 0; i < array.length; i++) {
      if (array[i][key] == value) {
        return array[i];
      }
    }
    return null;
  }%>
angular.module('<%=appname%>')
  .directive('navPanel', function(htmlExtended, navPanelCustom, clientConstants) {
    return {
      restrict: 'C',
      templateUrl : function() {
			  if(htmlExtended['header.navPanel']){
				  return htmlExtended['header.navPanel'];
			  }
			  return clientConstants.partialsBaseLocation + "/navPanel/navPanel.html"
            },
      controller: function($scope, navPanelCustom) {
        this.togglePanel = function() {
          $('.navPanel').toggleClass('panelOpen');
          $('.navPanel').toggleClass('panelClosed');
        };
        
        //standardNav is built by yaktor-ui
        var standardNav = [
          <% _.each(moduleNames.agents, function(moduleName, index) { %>
          {
            'title': '<%=moduleName.replace(/_/g, " ") %>',
            'link': 'main.<%=moduleName %>'
          },<%});%>
          <% _.each(moduleNames.crud, function(moduleName, index) {
            var method = ".FIND";
              var module = objectFindByKey(fullSpec.modules.crud, "name", moduleName);
              if (module.actions.elements["FIND"]) {
                method = ".FIND";
              // }else if module.actions.elements["POST"]) {
                // method = ".POST";
              } else {
                method = ".POST";
              }%>
          {
            'title': '<%=moduleName.replace(/_/g, " ") %>',
            'link': 'main.<%=moduleName %><%=method%>'
          }<%if (index != moduleNames.crud.length - 1){%>,<%}});%>
        ];

        $scope.mainNavigation = navPanelCustom.navs['main'] || standardNav; 
      //optional custom functions
        $scope.logout = navPanelCustom.logout;
        $scope.account = navPanelCustom.account;
        
      },
      link: function(scope, element, attrs, scidFooterController, $translate, $filter) {
      
      }
    }
  })