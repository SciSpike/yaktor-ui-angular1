"use strict";

module.exports = function(grunt) {
	
	var loadGruntTasks = require('load-grunt-tasks')(grunt, {
	    pattern: 'grunt-*',
	    config: './package.json',
	    scope: 'dependencies'
	});
	
	console.log(loadGruntTasks);
	
  var config, dir, customGrunt;
  var basePath = grunt.option('basePath') || "./";
  
 dir = require("./gruntTasks/dirs");
 customGrunt = require("./Gruntfile_custom.js");
  
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
          './compiled.css': ['./styles/engine-ui.css', './bower_components/select2/select2.css', './styles/custom/master.css', './bower_components/ng-grid/*.min.css']
        }
      }
    },
    watch: {
      less: {
        files: './**/*.less',
        tasks: ['less', 'cssmin'],
        options: {
          interrupt: true,
        },
      }
    }
  };
  
  grunt.initConfig(config);
  
  var sharedTasks = ['less', 'browserify:build', 'browserify:appDep', 'browserify:libs', 'cssmin'];
  var serveTasks = ['watch'];
  
  grunt.registerTask('default', sharedTasks.concat(serveTasks));
  
  for (var key in customGrunt) {
	  var taskName = customGrunt[key]['name'];
	  var obj = {};
	  obj[taskName] = customGrunt[key][taskName];
	  grunt.extendConfig(obj);
	  var customTask = [customGrunt[key].name];
	  grunt.registerTask(key, sharedTasks.concat(customTask));
  }
};
