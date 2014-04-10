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
    less: require("./gruntTasks/less"),
    cssmin: {
      combine: {
        files: {
          './compiled.css': ['./styles/engine-ui.css', './styles/custom/master.css', './bower_components/ng-grid/*.min.css']
        }
      }
    },
    watch: {
      scripts: {
        files: './**/*.less',
        tasks: ['less', 'cssmin'],
        options: {
          interrupt: true,
        },
      },
    }
  };
  
  grunt.initConfig(config);
  
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
  
  grunt.registerTask('default', ['less', 'browserify:build', 'browserify:appDep', 'browserify:libs', 'cssmin', 'watch']);
  
};
