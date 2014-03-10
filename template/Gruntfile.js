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
	  		'./libs/controllers.js': ['./controller/*.js'],
	  		'./libs/custom_controllers.js': ['./controller/custom/*.js'],
	  		'./libs/all_in_one.js': ['../**/*allInOne.js']
		},
		options: {
			transform: ['uglifyify']
		}
	  }
	}
  };
  
  grunt.initConfig(config);
  grunt.loadNpmTasks('grunt-browserify');
  grunt.registerTask('default', ['browserify:dist']);
  
};
