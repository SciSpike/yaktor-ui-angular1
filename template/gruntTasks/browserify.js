module.exports = {
  libs: {
    options: {
      shim: {
        jquery: {
          path: './bower_components/jquery/dist/jquery.js',
          exports: '$'
        },
        angular: {
          path: './bower_components/angular/angular.js',
          exports: 'angular',
          depends: { jquery: '$' }
        },
        'uirouter': {
          path: './bower_components/angular-ui-router/release/angular-ui-router.js',
          exports: 'uirouter',
          depends: {jquery: '$', angular:'angular'}
        },
        'bootstrap': {
          path: './bower_components/angular-bootstrap/ui-bootstrap.js',
          exports: 'bootstrap'
        }
      }
    },
    src: ['./bower_components/jquery/dist/jquery.js', './bower_components/angular/angular.js', './bower_components/angular-ui-router/release/angular-ui-router.js', './bower_components/angular-bootstrap/ui-bootstrap.js'],
    dest: './libs/libs.js'
  },
  build: {
	  	files: {
	  		'./libs/controllers.js': ['./controller/*.js'],
	  		'./libs/directives.js': ['./modules/**/*.js'],
	  		'./libs/custom_controllers.js': ['./controller/custom/*.js'],
	  		'./libs/all_in_one.js': ['../**/*allInOne.js']
		},
		options: {
			
		}
  }
};