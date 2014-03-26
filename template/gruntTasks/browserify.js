var browserifyLibExternal = [
	
];

var browserifyLibAlias = [
  './bower_components/emitter/index.js:emitter-component',
  './bower_components/node-querystring/index.js:qs',
  '../node_modules/tv4/tv4.js:tv4',
  '../public/socketApi.js:socketApi'
];


module.exports = {
	  build: {
		options: {
			alias: browserifyLibAlias,
			external: browserifyLibExternal,
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
	  appDep: {
		  	files: {
          './libs/app.js': ["./app.js","constant/*.js","service/*.js"],
          './libs/controllers.js': ['./controller/*.js'],
          './libs/locale.js': ['./locale/*.js'],
		  		'./libs/directives.js': ['./modules/**/*.js'],
		  		'./libs/custom_controllers.js': ['./controller/custom/*.js'],
	        './libs/resources.js': ["bower_components/jquery/dist/jquery.min.js"
                                   ,"bower_components/angular/angular.js"
                                   ,"bower_components/angular-translate/angular-translate.js"
                                   ,"bower_components/angular-local-storage/angular-local-storage.js"
                                   ,"bower_components/angular-ui-router/release/angular-ui-router.js"
                                   ,"bower_components/angular-bootstrap/ui-bootstrap-tpls.js"
                                   ,"bower_components/sockjs-client/sockjs.min.js"]
			},
			options: {
			  external:['socketApi']
			}
	  }
};