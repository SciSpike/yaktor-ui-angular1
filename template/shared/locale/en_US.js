angular.module('views')
  .config(function ($translateProvider) {
    $translateProvider.translations('<%- locale%>',{
 		'SUBMIT': 'Submit',
 		'EDIT': 'Edit',
 		'LOGIN': 'Login',
 		'LOGOUT': 'Logout',
 		'ACCOUNT': 'Account'
    })
  });