"use strict";

module.exports = function(grunt) {
	
  var config, dir;
  
  var basePath = grunt.option('basePath') || "./";
  
  console.log(basePath);
  
 dir = require("./gruntTasks/dirs");
  
  try {
    dir.app = require("./bower.json").appPath || dir.app;
  } catch (_error) {}
  
  config = {
	basePath: basePath,
    dir: dir,
    browserify: {
	  dist: {
	  	files: {
	  		'./libs/lib.js': ['./controller/*.js']
		},
		options: {
			//transform: ['uglifyify']
		}
	  }
	}/*,
	uglify: {
		build: {
			files: [{
				expand: true,
                src: '*.js',
                dest: 'build/scripts',
                cwd: './libs'
            }]
          }
	}
    */
  };
  
  grunt.initConfig(config);
  
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('uglifyjs');
  
  grunt.registerTask('default', ['browserify:dist']);
  //grunt.registerTask('default', ['uglify:build']);
  
  /*grunt.registerTask('default', 'Set a config property.', function(name, val) {
	  grunt.config.set(name, val);
	});*/

  
};
