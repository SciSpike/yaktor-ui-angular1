var browserifyLibExternal = [
  '<%= basePath %>/<%= dir.bower %>/jquery/src/jquery.js',
  '<%= basePath %>/<%= dir.bower %>/angular/angular.js',
  '<%= basePath %>/<%= dir.bower %>/angular-ui-router/release/angular-ui-router.js',
  '<%= basePath %>/<%= dir.bower %>/angular-bootstrap/ui-bootstrap.js'
];

var browserifyLibAlias = [
  '<%= basePath %>/<%= dir.bower %>/jquery/src/jquery.js:jquery',
  '<%= basePath %>/<%= dir.bower %>/angular/angular.js:angular',
  '<%= basePath %>/<%= dir.bower %>/angular-ui-router/release/angular-ui-router.js:uirouter',
  '<%= basePath %>/<%= dir.bower %>/angular-bootstrap/ui-bootstrap.js:bootstrap'
];

module.exports = {
  libs: {
    options: {
      // Be sure to shim any libraries
      shim: {
        jquery: {
          path: '<%= basePath %>/<%= dir.bower %>/jquery/jquery.js',
          exports: '$'
        },
        angular: {
          path: '<%= basePath %>/<%= dir.bower %>/angular/angular.js',
          exports: 'angular',
          depends: { jquery: '$' }
        },
        'uirouter': {
          path: '<%= basePath %>/<%= dir.bower %>/angular-ui-router/release/angular-ui-router.js',
          exports: 'uirouter',
          depends: {jquery: '$', angular:'angular'}
        },
        'bootstrap': {
          path: '<%= basePath %>/<%= dir.bower %>/angular-bootstrap/ui-bootstrap.js',
          exports: 'bootstrap'
        }
      }
    },
    src: ['<%= basePath %>/<%= dir.libs %>/*.js'],
    dest: '<%= basePath %>/<%= dir.build %>/scripts/libs/libs.js'
  }
}