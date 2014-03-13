{{=<% %>=}}
//This is where you customize the behavior.
angular.module('<%appname%>')
  .config(function ($translateProvider) {
    $translateProvider.translations('en',{
      <%#keys%>
        "<%&key%>":"<%&title%>",
      <%/keys%>
      "APPNAME":"<%title%>" 
    })
  });