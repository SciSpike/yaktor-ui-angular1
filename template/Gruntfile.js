"use strict";

module.exports = function(grunt) {
	
	var loadGruntTasks = require('load-grunt-tasks')(grunt, {
	    pattern: 'grunt-*',
	    config: './package.json',
	    scope: 'dependencies'
	});
	
  var config, customGrunt;
  var basePath = grunt.option('basePath') || "./";
  
 customGrunt = require("./Gruntfile_custom.js");
  
  try {
    dir.app = require("./bower.json").appPath || dir.app;
  } catch (_error) {}
  
  config = {
    'browserify': require("./gruntTasks/browserify"),
    'less': require("./gruntTasks/less"),
    'cssmin': {
      'combine': {
        'files': {
          './styles/compiled.css': ['./styles/css/*.css', './bower_components/select2/select2.css', './bower_components/ng-grid/ng-grid.min.css']
        }
      }
    },
    'copy':{
      viz:{
        files:{
          'libs/resources/viz.js':"./bower_components/viz.js/index.js"
        }
      }
    },
    'sails-linker': {
    	'resources': {
	        'options': {
	            'startTag': '<!--RESOURCES-->',
	            'endTag': '<!--RESOURCES END-->',
	            'fileTmpl': '<script src="%s"></script>',
	            'appRoot': './'
	          },
	          'files': {
	            './index.html': ['./libs/resources/*.js']
	          }
	    },
        'libs': {
	        'options': {
	            'startTag': '<!--SCRIPTS-->',
	            'endTag': '<!--SCRIPTS END-->',
	            'fileTmpl': '<script src="%s"></script>',
	            'appRoot': './'
	          },
	          'files': {
	            './index.html': ['./libs/*.js', './libs/vendor/*.js']
	          }
        },
        'dev': {
        	'options': {
			            'startTag': '<!--CSS-->',
			            'endTag': '<!--CSS END-->',
			            'fileTmpl': '<link rel="stylesheet" href="%s" />',
			            'appRoot': './'
			          },
			          'files': {
			            './index.html': ['./styles/*.css', './bower_components/select2/select2.css', './bower_components/ng-grid/ng-grid.min.css']
			          }
		},
        'prod': {
        	'options': {
			            'startTag': '<!--CSS-->',
			            'endTag': '<!--CSS END-->',
			            'fileTmpl': '<link rel="stylesheet" href="%s" />',
			            'appRoot': './'
			          },
			          'files': {
			            './index.html': ['./styles/compiled.css']
			          }
		}
    }
  };
  
  grunt.initConfig(config);
  
  var sharedTasks = ['less','copy', 'browserify:build', 'browserify:appDep', 'browserify:libs', 'sails-linker:resources', 'sails-linker:libs'];
  var serveTasks = ['cssmin', 'sails-linker:prod'];
  var allTasks = sharedTasks.concat(serveTasks);
  
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
	    for (var prop in customGrunt[key]) {
	    	
	      var obj = {};
	      obj[prop] = customGrunt[key][prop];
	      
	      if(grunt.config.data[key]){
	        if(grunt.config.data[key][prop]){
	          grunt.config.data[key][prop] = MergeRecursive(grunt.config.data[key][prop], obj[prop]);
	        }else{
	          grunt.config.data[key][prop] = obj[prop];
	        }
	      }else{
	    	  if(key == 'unitTest' || key == 'e2eTest'){
	    		  grunt.extendConfig(obj);
	    		  var customTasks = sharedTasks.concat([prop]);
	    		  grunt.registerTask(key, customTasks);
	    	  }else{
	    		  grunt.config.data[key] = {};
		      	  grunt.config.data[key][prop] = obj[prop];
	    		  if(key == 'copy' || key == 'shell'){
		    		  sharedTasks.unshift(key);
		    	  }else{
		    		  sharedTasks.push(key);
		    	  }
	    	  }
	      }
	    }
	  }
  
  grunt.registerTask('default', allTasks);
  grunt.registerTask('dev', sharedTasks.concat(['sails-linker:dev', 'watch']));
  
};
