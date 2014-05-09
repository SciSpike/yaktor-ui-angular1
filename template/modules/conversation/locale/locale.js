{{=<% %>=}}
//This is where you customize the behavior.
angular.module('conversation')
  .config(function ($translateProvider) {
    $translateProvider.translations('<%&locale%>',{
      <%#keys%>
        "<%&key%>":"<%&title%>",
      <%/keys%>
      "APPNAME":"<%title%>" 
    })
  });