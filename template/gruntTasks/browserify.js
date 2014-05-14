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
  './bower_components/angular-local-storage/angular-local-storage.js:localStorageService',
  './bower_components/angular-bootstrap/ui-bootstrap-tpls.js:uiBootstrap',
  './bower_components/select2/select2.js:select2',
  './bower_components/angular-ui-select2/src/select2.js:uiSelect',
  './bower_components/ng-table/ng-table.min.js:ngTable'
];

var mainExternals = [
  './bower_components/jquery/dist/jquery.min.js',
  './bower_components/ng-grid/build/ng-grid.debug.js',
  './bower_components/angular-touch/angular-touch.min.js',
  './bower_components/angular/angular.js',
  './bower_components/angular-resource/angular-resource.js',
  './bower_components/angular-translate/angular-translate.js',
  './bower_components/angular-ui-router/release/angular-ui-router.js',
  './bower_components/angular-local-storage/angular-local-storage.js',
  './bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
  './bower_components/select2/select2.js',
  './bower_components/angular-ui-select2/src/select2.js',
  './bower_components/ng-table/ng-table.min.js'
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
  		dest: './libs/build.js'
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
          'localStorageService': {
            path: './bower_components/angular-local-storage/angular-local-storage.js',
            exports: 'localStorageService',
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
          'ngTable': {
              path: './bower_components/ng-table/ng-table.min.js',
              exports: 'ngTable',
              depends: {jquery: '$', angular: 'angular'}
          }
        }
      },
      src: [],
      dest: './libs/libs.js'
	  },
	  appDep: {
		  	files: {
		  		'./libs/services.js': ["./service/**/*.js"],
		  		'./libs/constants.js': ["./constant/*.js"],
		  		'./libs/components.js': ["./components/**/*.js"],
		  		'./libs/conversation.js': ["./modules/conversation/conversation.js", './modules/conversation/controller/**/*.js', './modules/conversation/locale/**/*.js'],
		  		'./libs/resources.js': ['bower_components/sockjs-client/sockjs.min.js']
			},
			options: {
			  alias: browserifyLibAlias,
			  external:mergedExternals
			}
	  }
};