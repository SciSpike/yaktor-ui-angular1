angular.module('views')
  .config(['$translateProvider', function ($translateProvider) {
    $translateProvider.translations('<%- locale%>',{
      'STATE': 'State',
      'ACTIONS': "Actions",
      'INIT': 'Init',
      'PENDING_NEW': 'Pending New ',
       <% _.each(keys, function(key, index){%>'<%- key.key %>':'<%- key.value %>'<% if(index != keys.length-1){%>,
       <% }}); %>
    })
  }]);