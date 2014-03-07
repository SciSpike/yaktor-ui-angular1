"use strict";

module.exports = function(grunt) {
	
  var config, dir;
  
 dir = require("./gruntTasks/dirs");
  
  try {
    dir.app = require("<%= basePath %>/bower.json").appPath || dir.app;
  } catch (_error) {}
  
  config = {
	basePath: "./",
    dir: dir,
    browserify: {
    	  dist: {
    	    files: {
    	  		'<%= basePath %>module.js': ['<%= basePath %>*.js']
    	    },
    	    options: {
    	      
    	    }
    	  }
      }
  };
  
  grunt.initConfig(config);
  
  grunt.loadNpmTasks('grunt-browserify');
  
  grunt.registerTask('default', ['browserify:dist']);
  
};
