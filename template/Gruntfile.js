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
    browserify: require("./gruntTasks/browserify"),
    cssmin: {
      combine: {
        files: {
          './styles/customStyles.css': ['./styles/scispike.css']
        }
      }
    }
  };
  
  grunt.initConfig(config);
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.registerTask('default', ['browserify:build', 'browserify:appDep', 'cssmin']);
  
};
