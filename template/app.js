(function() {
  'use strict';
  
  angular.module('<%=appname%>', ['ui.bootstrap', 'ui.router'])
    .config(function($stateProvider, $locationProvider) {
      
      $stateProvider
        
        <% Object.keys(states).forEach(function(stateName){ 
           var s = states[stateName]; 
           var controller = s.friendly;%>
        .state('<%-s.friendly%>', {
          url: '<%-stateName%>',
          templateUrl: 'partial/<%=controller%>.html',
          controller: '<%=controller%>Ctrl'
        })
        <%
          if(s.proto.match(/ws:/)){
            %><% include app/ws.js %><%
          } else {
            %><% include app/http.js %><%
          }
        %>
        <% });%>
      
    });

})();