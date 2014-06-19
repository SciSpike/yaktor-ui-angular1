module.exports = {
		
		'browserify':{
			  'appDep': {
					'files': {
						'./libs/components.js': ["./components/**/*.js"]
					}
			  },
			  'components':{
			        'files':{
			        	'./libs/components.js': ["./components/**/*.js"]
			        }
			  }
		}
		
};