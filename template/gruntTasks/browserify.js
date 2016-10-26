var browserifyLibExternal = [
  '../node_modules/eventemitter2/lib/eventemitter2.js',
  '../node_modules/qs/index.js',
  '../public/socketApi.js'
];

var browserifyLibAlias = [
  '../node_modules/eventemitter2/lib/eventemitter2.js:eventemitter2',
  '../node_modules/qs/index.js:qs',
  '../public/socketApi.js:socketApi',
  './bower_components/jquery/dist/jquery.min.js:$',
  './bower_components/angular-touch/angular-touch.min.js:ngTouch',
  './bower_components/angular/angular.js:angular',
  './node_modules/angular-animate/angular-animate.js:ngAnimate',
  './bower_components/angular-resource/angular-resource.js:angular.resource',
  './bower_components/angular-translate/angular-translate.js:angular.translate',
  './bower_components/angular-ui-router/release/angular-ui-router.js:uirouter',
  './bower_components/angular-sanitize/angular-sanitize.min.js:ngSanitize',
  './bower_components/ngstorage/ngStorage.min.js:ngStorage',
  './bower_components/angular-bootstrap/ui-bootstrap-tpls.js:uiBootstrap',
  './bower_components/angular-ui-select/dist/select.js:uiSelect',
  './bower_components/angular-ui-grid/ui-grid.min.js:uiGrid',
  './bower_components/angular-recaptcha/release/angular-recaptcha.js:vcRecaptcha',
  './node_modules/textangular/dist/textAngular-rangy.min.js:rangy',
  './node_modules/textangular/dist/textAngular.min.js:textAngular',
  './bower_components/moment/moment.js:moment',
  './bower_components/moment-timezone/builds/moment-timezone-with-data-2010-2020.min.js:moment.timezone'
 ];

var mainExternals = [
  './bower_components/jquery/dist/jquery.min.js',
  './bower_components/angular-touch/angular-touch.min.js',
  './bower_components/angular/angular.js',
  './node_modules/angular-animate/angular-animate.js',
  './bower_components/angular-resource/angular-resource.js',
  './bower_components/angular-translate/angular-translate.js',
  './bower_components/angular-sanitize/angular-sanitize.min.js',
  './bower_components/angular-ui-router/release/angular-ui-router.js',
  './bower_components/ngstorage/ngStorage.min.js',
  './bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
  './bower_components/angular-ui-select/dist/select.js',
  './bower_components/angular-ui-grid/ui-grid.min.js',
  './bower_components/angular-recaptcha/release/angular-recaptcha.js',
  './node_modules/textangular/dist/textAngular-rangy.min.js',
  './node_modules/textangular/dist/textAngular.min.js',
  './bower_components/moment/moment.js',
  './bower_components/moment-timezone/builds/moment-timezone-with-data-2010-2020.min.js'
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
            dest: ''
          }
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
            'ngAnimate' :{
              path: './node_modules/angular-animate/angular-animate.js',
              exports: 'ngAnimate',
              depends: { jquery: '$', angular:'angular'}
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
            'vcRecaptcha': {
              path: './bower_components/angular-recaptcha/release/angular-recaptcha.js',
              exports: 'vcRecaptcha',
              depends: {jquery: '$', angular: 'angular'}
            },
            'uiGrid': {
              path: './bower_components/angular-ui-grid/ui-grid.min.js',
              exports: 'uiGrid',
              depends: {angular: 'angular'}
            },
            'rangy': {
              path: './node_modules/textangular/dist/textAngular-rangy.min.js',
              exports: 'rangy',
              depends: {angular: 'angular'}
            },
            'textAngular': {
              path: './node_modules/textangular/dist/textAngular.min.js',
              exports: 'textAngular',
              depends: {angular: 'angular'}
            },
            'moment': {
              path: './bower_components/moment/moment.js',
              exports: 'moment',
              depends: {}
            },
            'moment.timezone': {
              path: './bower_components/moment-timezone/builds/moment-timezone-with-data-2010-2020.min.js',
              exports: 'moment.timezone',
              depends: {}
            }
          }
        },
        src: [],
        dest: './libs/resources/libs.js'
    },
    appDep: {
        files: {
          './libs/resources/resources.js': ['./bower_components/sockjs-client/dist/sockjs.js'],
          './libs/clientSetup.js': ['./client/config.js', 'setup.json'],
          './libs/client.js': ['./client/homePage/**/*.js', './client/controllers/**/*.js', './client/locale/**/*.js', './client/homePage/**/*.js', './client/services/**/*.js', './client/directives/**/*.js', './client/filters/**/*.js'],
          './libs/modules_extended.js': ['./client/modules/**/*.js'],
          './libs/services.js': ['./generated/services/**/*.js'],
          './libs/controllers.js': ['./generated/controllers/**/*.js'],
          './libs/directives.js': ['./generated/directives/**/*.js'],
          './libs/locale.js': ['./generated/locale/**/*.js'],
          <% _.each(moduleNames.agents, function(moduleName, index){%>
          './libs/modules/<%=moduleName %>.js': ['./generated/agents/<%=moduleName %>/<%=moduleName %>.js', './generated/agents/<%=moduleName %>/controllers/**/*.js', './generated/agents/<%=moduleName %>/directives/**/*.js', './generated/agents/<%=moduleName %>/services/**/*.js', './generated/agents/<%=moduleName %>/locale/**/*.js']<% if(index != moduleNames.length-1){%>,
         <% }}); %>
          <% _.each(moduleNames.crud, function(moduleName, index){%>
          './libs/modules/<%=moduleName %>.js': ['./generated/crud/<%=moduleName %>/<%=moduleName %>.js', './generated/crud/<%=moduleName %>/controllers/**/*.js', './generated/crud/<%=moduleName %>/directives/**/*.js', './generated/crud/<%=moduleName %>/services/**/*.js', './generated/crud/<%=moduleName %>/locale/**/*.js']<% if(index != moduleNames.length-1){%>,
         <% }}); %>
          <% _.each(moduleNames.resources, function(moduleName, index){%>
          './libs/modules/<%=moduleName %>.js': ['./shared/modules/<%=moduleName %>/<%=moduleName %>.js', './shared/modules/<%=moduleName %>/controllers/**/*.js', './shared/modules/<%=moduleName %>/directives/**/*.js', './shared/modules/<%=moduleName %>/services/**/*.js', './shared/modules/<%=moduleName %>/locale/**/*.js']<% if(index != moduleNames.length-1){%>,
         <% }}); %>
      },
      options: {
        alias: browserifyLibAlias,
        external:mergedExternals
      }
    }
};