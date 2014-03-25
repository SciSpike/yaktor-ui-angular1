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
    },
    concat: {
      dist: {
        src:["bower_components/jquery/dist/jquery.min.js"
             ,"bower_components/angular/angular.js"
             ,"bower_components/angular-translate/angular-translate.js"
             ,"bower_components/angular-local-storage/angular-local-storage.js"
             ,"bower_components/angular-ui-router/release/angular-ui-router.js"
             ,"bower_components/angular-bootstrap/ui-bootstrap-tpls.js"
             ,"bower_components/sockjs-client/sockjs.min.js"],
        dest:'./libs/ng.js'
      }
    }
  };
  
  grunt.initConfig(config);
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.registerTask('default', ['browserify:build', 'browserify:appDep', 'cssmin','concat']);
  
};
