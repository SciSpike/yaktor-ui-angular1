var browserifyLibExternal = [
  './bower_components/emitter/index.js',
  './bower_components/node-querystring/index.js',
  '../node_modules/tv4/tv4.js',
  '../public/socketApi.js'
];

var browserifyLibAlias = [
  './bower_components/emitter/index.js:emitter-component',
  './bower_components/node-querystring/index.js:qs',
  '../node_modules/tv4/tv4.js:tv4',
  '../public/socketApi.js:socketApi',
  './bower_components/jquery/dist/jquery.min.js:$',
  './bower_components/ng-grid/build/ng-grid.debug.js:ngGrid',
  './bower_components/angular-touch/angular-touch.min.js:ngTouch',
  './bower_components/angular/angular.js:angular',
  './bower_components/angular-resource/angular-resource.js:angular.resource',
  './bower_components/angular-translate/angular-translate.js:angular.translate',
  './bower_components/angular-ui-router/release/angular-ui-router.js:uirouter',
  './bower_components/ngstorage/ngStorage.min.js:ngStorage',
  './bower_components/angular-bootstrap/ui-bootstrap-tpls.js:uiBootstrap',
  './bower_components/select2/select2.js:select2',
  './bower_components/angular-ui-select2/src/select2.js:uiSelect',
  './bower_components/ng-grid/ng-grid-2.0.11.min.js:ngGrid'
 ];

var mainExternals = [
  './bower_components/jquery/dist/jquery.min.js',
  './bower_components/ng-grid/build/ng-grid.debug.js',
  './bower_components/angular-touch/angular-touch.min.js',
  './bower_components/angular/angular.js',
  './bower_components/angular-resource/angular-resource.js',
  './bower_components/angular-translate/angular-translate.js',
  './bower_components/angular-ui-router/release/angular-ui-router.js',
  './bower_components/ngstorage/ngStorage.min.js',
  './bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
  './bower_components/select2/select2.js',
  './bower_components/angular-ui-select2/src/select2.js',
  './bower_components/ng-grid/ng-grid-2.0.11.min.js'
];

var mergedExternals = browserifyLibExternal.concat(mainExternals);

module.exports = {
	  build: {
  		options: {
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
          'ngGrid': {
            path: './bower_components/ng-grid/build/ng-grid.debug.js',
            exports: 'ngGrid',
            depends: { jquery: '$' }
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
          'select2': {
              path: './bower_components/select2/select2.js',
              exports: 'select2',
              depends: {jquery: '$', angular: 'angular'}
          },
          'uiSelect': {
              path: './bower_components/angular-ui-select2/src/select2.js',
              exports: 'uiSelect',
              depends: {jquery: '$', angular: 'angular'}
          },
          'ngGrid': {
              path: './bower_components/ng-grid/ng-grid-2.0.11.min.js',
              exports: 'ngGrid',
              depends: {jquery: '$', angular: 'angular'}
          }
        }
      },
      src: [],
      dest: './libs/resources/libs.js'
	  },
	  appDep: {
		  	files: {
		  		'./libs/resources/resources.js': ['bower_components/sockjs-client/sockjs.min.js'],
		  		'./libs/shared.js': ['./shared/controllers/**/*.js', './shared/directives/**/*.js', './shared/services/**/*.js'],
		  		'./clientConfig/clientSetup.js': ['./clientConfig/init/**/*.js'],
		  		'./libs/clientConfig.js': ['./clientConfig/settings.js', './clientConfig/custom/*.js'],
		  		'./libs/locale.js': ['./shared/locale/**/*.js', './modules/locale/**/*.js'], 
		  		<% _.each(moduleNames.agents, function(moduleName, index){%>
		  		'./libs/modules/<%- moduleName %>.js': ['./modules/<%- moduleName %>/<%- moduleName %>.js', './modules/<%- moduleName %>/controllers/**/*.js', './modules/<%- moduleName %>/directives/**/*.js', './modules/<%- moduleName %>/services/**/*.js']<% if(index != moduleNames.length-1){%>,
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