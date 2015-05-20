"use strict";

module.exports = function(grunt) {

  var loadGruntTasks = require('load-grunt-tasks')(grunt, {
    pattern: 'grunt-*',
    config: './package.json',
    scope: 'dependencies'
  });

  var config, customGrunt;
  var basePath = grunt.option('basePath') || "./";
  var appName = require("../package.json").name;
  var cordovaAppRoot = 'cordova-app/'+ appName + '/www/';

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
          './styles/compiled.css': ['./styles/css/*.css', './bower_components/angular-ui-select/dist/select.css', './bower_components/ng-grid/ng-grid.min.css']
        }
      }
    },
    'copy': {
      'viz': {
        'files': {
          'libs/resources/viz.js': "./bower_components/viz.js/index.js"
        }
      },
      'cordova-index': {
        'src': './cordova_template/index.html',
        'dest': cordovaAppRoot + 'index.html'
        },
      'cordova-indexjs': {
        'src': './cordova_template/js/index.js',
        'dest': cordovaAppRoot + 'js/index.js'
      },
      'cordova-js': {
        'src': ['libs/**/*.js','./clientConfig/**', './app.js', './appConfig.js'],
        'dest': cordovaAppRoot
        },
      'cordova-css': {
        'src': './styles/compiled.css',
        'dest': cordovaAppRoot + 'compiled.css'
        },
      'cordova-partials': {
        'src': 'partials/**/*.html',
        'dest': cordovaAppRoot
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
          './index.html': ['./libs/resources/*.js'],
          './cordova_template/index.html': ['./libs/resources/*.js']
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
          './index.html': ['./libs/*.js', './libs/vendor/*.js'],
          './cordova_template/index.html': ['./libs/*.js', './libs/vendor/*.js']
        }
      },
      'modules': {
        'options': {
          'startTag': '<!--MODULES-->',
          'endTag': '<!--MODULES END-->',
          'fileTmpl': '<script src="%s"></script>',
          'appRoot': './'
        },
        'files': {
          './index.html': ['./libs/modules/*.js'],
          './cordova_template/index.html': ['./libs/modules/*.js'],
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
    },
	  'watch': {
		  'options': {
			  'livereload': true
		  },
		  'less': {
			  'files': './**/*.less',
			  'tasks': ['less', 'cssmin', 'autoprefixer'],
			  'options': {
				  'interrupt': true
			  }
		  }
	  },
	  'autoprefixer': {
		  'options': {
			  // Task-specific options go here.
		  },
		  'single_file': {
			  'options': {
				  // Target-specific options go here.
			  },
			  'src': './styles/compiled.css',
			  'dest': './styles/compiled-prefix.css'
		  },
		  'sourcemap': {
			  'options': {
				  'map': true,
				  //'annotation': 'main.css.map'
			  },

			  'src': './styles/compiled.css',
			  'dest': './styles/compiled-prefix.css' // -> dest/css/file.css, sourcemap is inlined
		  }
	  },
    'shell': {
      'cordova-create': {
        'command': ['sleep 1', 'mkdir cordova-app', 'cd cordova-app', '$(npm bin)/cordova create '+ appName + ' com.fed.'+ appName + '  '+ appName].join("&&"),
        'help': "creates cordova app"
      },
      'cordova-deploy': {
        'command': ['sleep 1', 'cd cordova-app/'+appName,'$(npm bin)/cordova run android'].join('&&'),
        'help': "Deploys already built project to the device/emulator"
      }
    }
  };

  grunt.initConfig(config);

  var sharedTasks = ['less', 'copy:viz', 'browserify:build', 'browserify:appDep', 'browserify:libs', 'sails-linker:resources', 'sails-linker:modules', 'sails-linker:libs'];
  var serveTasks = ['cssmin', 'autoprefixer', 'sails-linker:prod'];
  var cordovaCopy = ['copy:cordova-js','copy:cordova-css','copy:cordova-partials', 'copy:cordova-index', 'copy:cordova-indexjs'];
  
  var allTasks = sharedTasks.concat(serveTasks);

  /* ########## INCORPORATING CUSTOM TASKS DEFINED IN CUSTOMGRUNT ########## */

  /* ########## Recursively merge properties of two objects ########## */

  function MergeRecursive(obj1, obj2) {
    for (var p in obj2) {
      try {
        // Property in destination object set; update its value.
        if (obj2[p].constructor == Object) {
          obj1[p] = MergeRecursive(obj1[p], obj2[p]);
        } else {
          obj1[p] = obj2[p];
        }
      } catch (e) {
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

      if (grunt.config.data[key]) {
        if (grunt.config.data[key][prop]) {
          grunt.config.data[key][prop] = MergeRecursive(grunt.config.data[key][prop], obj[prop]);
        } else {
          grunt.config.data[key][prop] = obj[prop];
        }
      } else {
        if (key == 'unitTest' || key == 'e2eTest') {
          grunt.extendConfig(obj);
          var customTasks = sharedTasks.concat([prop]);
          grunt.registerTask(key, customTasks);
        } else {
          grunt.config.data[key] = {};
          grunt.config.data[key][prop] = obj[prop];
          if (key == 'copy' || key == 'shell') {
            sharedTasks.unshift(key);
          } else {
            sharedTasks.push(key);
          }
        }
      }
    }
  }

  grunt.registerTask('default', allTasks.concat(['watch']));
  grunt.registerTask('dev', sharedTasks.concat(['sails-linker:dev', 'watch']));
  grunt.registerTask('cordova', cordovaCopy);

};
