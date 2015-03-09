angular.module('views')
  .config(function ($translateProvider) {
    $translateProvider.translations('<%- locale%>',{
      'STATES': 'States',
      'ACTIONS': "Actions",
      'INIT': 'Init',
       <% _.each(keys, function(key, index){%>'<%- key.key %>':'<%- key.value %>'<% if(index != keys.length-1){%>,
       <% }}); %>
    })
  });