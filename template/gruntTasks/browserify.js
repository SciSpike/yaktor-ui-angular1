var browserifyLibExternal = [
  '../node_modules/emitter-component/index.js',
  '../node_modules/qs/index.js',
  '../public/socketApi.js'
];

var browserifyLibAlias = [
  '../node_modules/emitter-component/index.js:emitter-component',
  '../node_modules/qs/index.js:qs',
  '../public/socketApi.js:socketApi',
  './bower_components/jquery/dist/jquery.min.js:$',
  './bower_components/ng-grid/build/ng-grid.debug.js:ngGrid',
  './bower_components/angular-touch/angular-touch.min.js:ngTouch',
  './bower_components/angular/angular.js:angular',
  './bower_components/angular-resource/angular-resource.js:angular.resource',
  './bower_components/angular-translate/angular-translate.js:angular.translate',
  './bower_components/angular-ui-router/release/angular-ui-router.js:uirouter',
  './bower_components/angular-sanitize/angular-sanitize.min.js:ngSanitize',
  './bower_components/ngstorage/ngStorage.min.js:ngStorage',
  './bower_components/angular-bootstrap/ui-bootstrap-tpls.js:uiBootstrap',
  './bower_components/angular-ui-select/dist/select.js:uiSelect',
  './bower_components/ng-grid/ng-grid-2.0.14.min.js:ngGrid',
  './bower_components/angular-ui-grid/ui-grid.min.js:uiGrid',
  './bower_components/angular-recaptcha/release/angular-recaptcha.js:vcRecaptcha'
 ];

var mainExternals = [
  './bower_components/jquery/dist/jquery.min.js',
  './bower_components/ng-grid/build/ng-grid.debug.js',
  './bower_components/angular-touch/angular-touch.min.js',
  './bower_components/angular/angular.js',
  './bower_components/angular-resource/angular-resource.js',
  './bower_components/angular-translate/angular-translate.js',
  './bower_components/angular-sanitize/angular-sanitize.min.js',
  './bower_components/angular-ui-router/release/angular-ui-router.js',
  './bower_components/ngstorage/ngStorage.min.js',
  './bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
  './bower_components/angular-ui-select/dist/select.js',
  './bower_components/ng-grid/ng-grid-2.0.14.min.js',
  './bower_components/angular-ui-grid/ui-grid.min.js',
  './bower_components/angular-recaptcha/release/angular-recaptcha.js'
];

var mergedExternals = browserifyLibExternal.concat(mainExternals);

module.exports = {
    build: {
      options: {
        transform: [
          "uglifyify"
        ],
        alias: browserifyLibAlias,
        external: mainExternals,
        aliasMappings: [
          {
            cwd: '../public/api',
            src: ['*/*.js'],
            dest: '',
          },
        ]
      },
      src: [],
      dest: './libs/resources/build.js'
    },
    libs:{
        options: {
          transform: [
            "uglifyify"
          ],
          shim: {
            jquery: {
              path: './bower_components/jquery/dist/jquery.min.js',
              exports: '$'
            },
            angular: {
              path: './bower_components/angular/angular.js',
              exports: 'angular',
              depends: { jquery: '$' }
            },
            'angular.resource' :{
              path: './bower_components/angular-resource/angular-resource.js',
              exports: '$resource',
              depends: { jquery: '$', angular:'angular'}
            },
            'angular.translate' :{
              path: './bower_components/angular-translate/angular-translate.js',
              exports: '$translate',
              depends: { jquery: '$', angular:'angular'}
            },
            'ngSanitize' :{
              path: './bower_components/angular-sanitize/angular-sanitize.js',
              exports: 'ngSanitize',
              depends: { jquery: '$', angular:'angular'}
            },
            'uirouter': {
              path: './bower_components/angular-ui-router/release/angular-ui-router.js',
              exports: 'uirouter',
              depends: {jquery: '$', angular:'angular'}
            },
            'ngStorage': {
              path: './bower_components/ngstorage/ngStorage.min.js',
              exports: 'ngStorage',
              depends: {jquery: '$', angular:'angular'}
            },
            'ngTouch': {
              path: './bower_components/angular-touch/angular-touch.min.js',
              exports: 'ngTouch',
              depends: {jquery: '$', angular: 'angular'}
            },
            'uiBootstrap': {
              path: './bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
              exports: 'uiBootstrap',
              depends: {jquery: '$', angular: 'angular'}
            },
            'uiSelect': {
                path: './bower_components/angular-ui-select/dist/select.js',
                exports: 'uiSelect',
                depends: {jquery: '$', angular: 'angular'}
            },
            'ngGrid': {
                path: './bower_components/ng-grid/ng-grid-2.0.14.min.js',
                exports: 'ngGrid',
                depends: {jquery: '$', angular: 'angular'}
            },
            'vcRecaptcha': {
              path: './bower_components/angular-recaptcha/release/angular-recaptcha.js',
              exports: 'vcRecaptcha',
              depends: {jquery: '$', angular: 'angular'}
            },
            'uiGrid': {
              path: './bower_components/angular-ui-grid/ui-grid.min.js',
              exports: 'uiGrid',
              depends: {angular: 'angular'}
            }
          }
        },
        src: [],
        dest: './libs/resources/libs.js'
    },
    appDep: {
        files: {
          './libs/resources/resources.js': ['bower_components/sockjs-client/dist/sockjs.js'],
          './libs/shared.js': ['./shared/modules/utilities/**/*.js', './shared/controllers/**/*.js', './shared/directives/**/*.js', './shared/services/**/*.js', './shared/filters/**/*.js'],
          './clientConfig/clientSetup.js': ['./clientConfig/init/**/*.js'],
          './libs/clientConfig.js': ['./clientConfig/custom/**/*.js'],
          './libs/locale.js': ['./shared/locale/**/*.js', './modules/locale/**/*.js'], 
          <% _.each(moduleNames.agents, function(moduleName, index){%>
          './libs/modules/<%- moduleName %>.js': ['./modules/agents/<%- moduleName %>/<%- moduleName %>.js', './modules/agents/<%- moduleName %>/controllers/**/*.js', './modules/agents/<%- moduleName %>/directives/**/*.js', './modules/agents/<%- moduleName %>/services/**/*.js']<% if(index != moduleNames.length-1){%>,
         <% }}); %>
         <% _.each(moduleNames.crud, function(moduleName, index){%>
          './libs/modules/<%- moduleName %>.js': ['./modules/crud/<%- moduleName %>/<%- moduleName %>.js', './modules/crud/<%- moduleName %>/controllers/**/*.js', './modules/crud/<%- moduleName %>/directives/**/*.js', './modules/crud/<%- moduleName %>/services/**/*.js']<% if(index != moduleNames.length-1){%>,
         <% }}); %>
         <% _.each(moduleNames.resources, function(moduleName, index){%>
        './libs/modules/<%- moduleName %>.js': ['./shared/modules/<%- moduleName %>/<%- moduleName %>.js', './shared/modules/<%- moduleName %>/controllers/**/*.js', './shared/modules/<%- moduleName %>/directives/**/*.js', './shared/modules/<%- moduleName %>/services/**/*.js']<% if(index != moduleNames.length-1){%>,
      <% }}); %>
      },
      options: {
        alias: browserifyLibAlias,
        external:mergedExternals
      }
    }
};