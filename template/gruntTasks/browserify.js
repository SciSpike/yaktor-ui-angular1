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
          './libs/controllers.js': ['./controller/*.js'],
          './libs/locale.js': ['./locale/*.js'],
		  		'./libs/directives.js': ['./modules/**/*.js'],
		  		'./libs/custom_controllers.js': ['./controller/custom/*.js']
			},
			options: {
				
			}
	  }
};