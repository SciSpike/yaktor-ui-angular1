angular.module('views').config(function ($translateProvider) {
  $translateProvider.translations('<%- locale%>', {
    'SUBMIT' : 'Submit',
    'EDIT' : 'Edit',
    'LOGIN' : 'Login',
    'LOGOUT' : 'Logout',
    'ACCOUNT' : 'Account',
    'TRUE' : 'True',
    'FALSE' : 'False',
    'MAKE.SELECTION': 'Make Selection'
  })
});