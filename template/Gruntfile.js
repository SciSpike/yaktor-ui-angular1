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
    browserify: require("./gruntTasks/browserify")
  };
  
  grunt.initConfig(config);
  grunt.loadNpmTasks('grunt-browserify');
  grunt.registerTask('default', ['browserify:libs', 'browserify:build']);
  
};
