angular.module('views')
  .config(function ($translateProvider) {
    $translateProvider.translations('<%- locale%>',{
      'STATE': 'State',
      'ACTIONS': "Actions",
      'INIT': 'Init',
      'PENDING_NEW': 'Pending New ',
      'OPTIONAL_FIELD_LABEL': ' (optional)',
       <% _.each(keys, function(key, index){%>'<%- key.key %>':'<%- key.value %>'<% if(index != keys.length-1){%>,
       <% }}); %>
    })
  });