angular.module('views')
  .config(['$translateProvider', function ($translateProvider) {
    $translateProvider.translations('<%=locale%>',{
      'STATE': 'State',
      'ACTIONS': "Actions",
      'INIT': 'Init',
      'PENDING_NEW': 'Pending New ',
      '_CANCEL.DELETE':'Cancel',
      '_CONFIRM.DELETE':'Confirm',
      'SHOW.FILTER.OPTIONS':'Show Filter Options',
      'CREATE.NEW': "Create New",
      'NO.FILTER.RESULTS': "No Results",
      'NO.RESULTS': "No Results",
      
       <% _.each(keys, function(key, index){%>'<%=key.key %>':'<%=key.value %>'<% if(index != keys.length-1){%>,
       <% }}); %>
    })
  }]);