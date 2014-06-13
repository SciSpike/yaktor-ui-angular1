"use strict";

module.exports = function(grunt) {
	
	var loadGruntTasks = require('load-grunt-tasks')(grunt, {
	    pattern: 'grunt-*',
	    config: './package.json',
	    scope: 'dependencies'
	});
	
  var config, dir, customGrunt;
  var basePath = grunt.option('basePath') || "./";
  
 dir = require("./gruntTasks/dirs");
 customGrunt = require("./Gruntfile_custom.js");
  
  try {
    dir.app = require("./bower.json").appPath || dir.app;
  } catch (_error) {}
  
  config = {
    'basePath': basePath,
    'dir': dir,
    'browserify': require("./gruntTasks/browserify"),
    'less': require("./gruntTasks/less"),
    'cssmin': {
      'combine': {
        'files': {
          './compiled.css': ['./styles/engine-ui.css', './styles/custom/master.css', './bower_components/select2/select2.css', './bower_components/ng-table/ng-table.min.css', './bower_components/ng-grid/ng-grid.min.css']
        }
      }
    },
    'sails-linker': {
        'defaultOptions': {
        'options': {
            'startTag': '<!--SCRIPTS-->',
            'endTag': '<!--SCRIPTS END-->',
            'fileTmpl': '<script src="%s"></script>',
            'appRoot': './'
          },
          'files': {
            './index.ejs': ['./compiled_modules/*.js', './scripts/ng-grid-layout.js']
          }
        }
    },
    'watch': {
      'less': {
        'files': './**/*.less',
        'tasks': ['less', 'cssmin'],
        'options': {
          'interrupt': true,
        }
      }
    }
  };
  
  grunt.initConfig(config);
  
  var sharedTasks = ['less', 'browserify:build', 'browserify:appDep', 'browserify:libs', 'browserify:components', 'sails-linker', 'cssmin'];
  var serveTasks = ['watch'];
  var allTasks = sharedTasks.concat(serveTasks)
  
  
  
  
  
  
  /* ########## INCORPORATING CUSTOM TASKS DEFINED IN CUSTOMGRUNT ########## */
  
  /* ########## Recursively merge properties of two objects ########## */
  function MergeRecursive(obj1, obj2) {
    for (var p in obj2) {
      try {
        // Property in destination object set; update its value.
        if ( obj2[p].constructor==Object ) {
          obj1[p] = MergeRecursive(obj1[p], obj2[p]);
        } else {
          obj1[p] = obj2[p];
        }
      } catch(e) {
        // Property in destination object not set; create it and set its value.
        obj1[p] = obj2[p];
      }
    }
    return obj1;
  }


  for (var key in customGrunt) {
    console.log('##########');
    console.log(key);
    for (var prop in customGrunt[key]) {
      var taskName = prop;
      var obj = {};
      obj[taskName] = customGrunt[key][taskName];
      if(grunt.config.data[key]){
        if(grunt.config.data[key][taskName]){
          grunt.config.data[key][taskName] = MergeRecursive(grunt.config.data[key][taskName], obj[taskName]);
        }else{
          grunt.config.data[key][taskName] = obj[taskName];
        }
      }else{
    	grunt.config.data[key] = {};
    	grunt.config.data[key][taskName] = obj[taskName];
    	if(key == 'copy'){
    		allTasks.unshift('copy');
    	}
		if(key == 'shell'){
    		allTasks.unshift('shell');
    	}
    	//var customTask = [key];
        //grunt.registerTask(key, customTask);
      }
    }
  }
  
  
  //console.log(grunt.config.data);
  console.log(allTasks);
  grunt.registerTask('default', allTasks);
};
