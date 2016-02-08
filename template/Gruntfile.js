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
  var cordovaAppRoot = 'cordova-app/' + appName + '/www/';

  customGrunt = require("./Gruntfile_custom.js");

  try {
    dir.app = require("./bower.json").appPath || dir.app;
  } catch (_error) {}

  config = {
    'browserify': require("./gruntTasks/browserify"),
    'clean':['./styles/css/'],
    'less':require("./gruntTasks/less"),
    'cssmin': {
      'combine': {
        'files': {
          './styles/compiled.css': ['./styles/css/*.css', './bower_components/angular-ui-select/dist/select.css', './bower_components/ng-grid/ng-grid.min.css', './bower_components/angular-ui-grid/ui-grid.min.css']
        }
      }
    },
    'copy': {
      'grid': {
        'src': ['./bower_components/angular-ui-grid/ui-grid.eot','./bower_components/angular-ui-grid/ui-grid.svg', './bower_components/angular-ui-grid/ui-grid.ttf', './bower_components/angular-ui-grid/ui-grid.woff'],
        'dest': './styles/',
        'filter': 'isFile',
        'flatten': true,
        'expand': true
      },
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
        'src': ['libs/**/*.js', './client/**', './app.js', './appConfig.js'],
        'dest': cordovaAppRoot
      },
      'cordova-css': {
        'src': './styles/compiled.css',
        'dest': cordovaAppRoot + 'compiled.css'
      },
      'cordova-partials': {
        'src': 'generated/partials/**/*.html',
        'dest': cordovaAppRoot
      },
      'cordova-fonts': {
        'src':'fonts/**',
        'dest': cordovaAppRoot + '/fonts',
        'filter': 'isFile',
        'flatten': true,
        'expand': true
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
          './index.html': ['./libs/*.js'],
          './cordova_template/index.html': ['./libs/*.js']
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
    uglify: {
      options: {
        mangle: false,
        sourceMap: true
      },
      my_target: {
        files: {
          'libs/modules.min.js': ['./libs/modules/*.js'],
          'libs/vendor.min.js': ['./libs/vendor/*.js']
        }
      }
    },
    'watch': {
      'options': {
        'livereload': true
      },
      'less': {
        'files': './**/*.less',
        'tasks': ['less:common', 'cssmin', 'autoprefixer'],
        'options': {
          'interrupt': true
        }
      },
      'resources': {
        'files': [
          'bower_components/sockjs-client/dist/sockjs.js',
          './shared/**/*.js',
          './generated/*.js',
          './generated/directives/**/*.js',
          './generated/services/**/*.js',
          './generated/utilities/**/*.js',
          './client/**/*.js',
          './generated/locale/**/*.js'
        ],
        'tasks': ['browserify:appDep', 'sails-linker:libs'],
        'options': {
          'interrupt': true
        }
      },
      <% _.each(moduleNames.agents, function(moduleName, index) { %>
          '<%- moduleName %>/': {
            'files': './generated/agents/<%- moduleName %>/**/*.js',
            'tasks': ['browserify:appDep', 'sails-linker:libs'],
            'options': {
              'interrupt': true
            }
        },
        <%
      }); %> <% _.each(moduleNames.crud, function(moduleName, index) { %>
          '<%- moduleName %>/': {
            'files': './generated/crud/<%- moduleName %>/**/*.js',
            'tasks': ['browserify:appDep', 'sails-linker:libs'],
            'options': {
              'interrupt': true
            }
        },
        <%
      }); %>
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
      'install-packages': {
        'command': ['npm install', '$(npm bin)/bower install --verbose'].join('&&'),
        'help': "Runs npm install and bower install"
      },
      'cordova-create': {
        'command': ['sleep 1', 'mkdir cordova-app', 'cd cordova-app', 'cordova create ' + appName + ' com.fed.' + appName + '  ' + appName, 'cd ' + appName, 'cordova platforms add android', 'cordova platforms add ios'].join("&&"),
        'help': "creates cordova app, adds android and iOs platforms"
      },
      'cordova-deploy-android': {
        'command': ['sleep 1', 'cd ./cordova-app/' + appName, 'cordova run android'].join('&&'),
        'help': "Deploys already built project to the android device/emulator"
      },
      'cordova-prepare-android': {
        'command': ['sleep 1', 'cd ./cordova-app/' + appName, 'cordova prepare android'].join('&&'),
        'help': "Deploys already built project to the android device/emulator"
      },
      'cordova-deploy-ios': {
        'command': ['sleep 1', 'cd ./cordova-app/' + appName, 'cordova run ios'].join('&&'),
        'help': "Deploys already built project to the ios device/emulator"
      },
      'cordova-prepare-ios': {
        'command': ['sleep 1', 'cd ./cordova-app/' + appName, 'cordova prepare ios'].join('&&'),
        'help': "Deploys already built project to the ios device/emulator"
      },
      'clean-android': {
        'command': ['sleep 1', 'cd cordova-app/' + appName,'cordova platforms rm android', 'sleep 1', 'cordova platforms add android'].join('&&'),
        'help': "Reinstalls android platform.  Fire the hooks that removes and reinstalls plugins.  NOTE: This WILL destroy android app configs."
      }, 
      'clean-ios': {
        'command': ['sleep 1', 'cd cordova-app/' + appName,'cordova platforms rm ios', 'sleep 1', 'cordova platforms add ios'].join('&&'),
        'help': "Reinstalls ios platform.  Fires the hooks that removes and reinstalls plugins.  NOTE: This WILL destroy ios project settings."
      }
      
    }
  };

  grunt.initConfig(config);

  var sharedTasks = ['clean', 'less:common', 'copy:grid', 'copy:viz', 'browserify:build', 'browserify:appDep', 'browserify:libs', 'uglify', 'sails-linker:resources', 'sails-linker:libs', 'copy:custom', 'sails-linker:custom'];
  var serveTasks = ['cssmin', 'autoprefixer', 'sails-linker:prod'];
  var cordovaPrep = ['shell:install-packages', 'clean','less:cordova', 'copy:grid', 'copy:viz', 'browserify:build', 'browserify:appDep', 'browserify:libs', 'sails-linker:resources', 'sails-linker:libs', 'copy:custom', 'sails-linker:custom', 'cssmin', 'copy:cordova-js', 'copy:cordova-css', 'copy:cordova-partials', 'copy:cordova-index', 'copy:cordova-indexjs', 'copy:cordova-fonts'];
  var cordovaDeployAndroid = ['shell:cordova-deploy-android'];
  var cordovaDeployiOS = ['shell:cordova-deploy-ios'];
  var cordovaPrepAndroid = ['shell:cordova-prepare-android'];
  var cordovaPrepiOS = ['shell:cordova-prepare-ios'];
  
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
  
  for (var task in config.shell) {
    grunt.registerTask(task, 'shell:' + task);
  }

  var getHelpText = function(task) {
    return config.shell[task].help || "";
  };

  grunt.registerTask('default', allTasks);
  grunt.registerTask('dev', sharedTasks.concat(['sails-linker:dev', 'watch']));
  grunt.registerTask('android-deploy', cordovaPrep.concat(cordovaDeployAndroid));
  grunt.registerTask('ios-deploy', cordovaPrep.concat(cordovaDeployiOS));
  grunt.registerTask('android-prep', cordovaPrep.concat(cordovaPrepAndroid));
  grunt.registerTask('ios-prep', cordovaPrep.concat(cordovaPrepiOS));

  grunt.registerTask('help', 'List available tasks', function(x){
    var Table = require('cli-table');
    var taskTable = new Table({
      chars: { 'top': '' , 'top-mid': '' , 'top-left': '' , 'top-right': ''
             , 'bottom': '' , 'bottom-mid': '' , 'bottom-left': '' , 'bottom-right': ''
             , 'left': '' , 'left-mid': '' , 'mid': '' , 'mid-mid': ''
             , 'right': '' , 'right-mid': '' , 'middle': ' ' },
      style: { 'padding-left': 0, 'padding-right': 0 }
    });

    var tasks = ['default', 'dev'];
    taskTable.push(
      ['default', 'standard build'],
      ['dev', 'Builds with sails-linker:dev and a watch'],
      ['android-prep', 'installs npm and bower, compiles Front End ready to deploying with IDE of choice.'],
      ['ios-prep', 'installs npm and bower, compiles Front End ready to deploying with Xcode.'],
      ['android-deploy', 'installs npm and bower, compiles Front End, deploys to android device/emulator.'],
      ['ios-deploy', 'installs npm and bower, compiles Front End, deploys to iOS device/emulator.']
    );
    for (var task in config.shell) {
      tasks.push(task);
      taskTable.push([task, getHelpText(task)]);
    }

    console.log("Useage:");
    console.log("\t"+ tasks.join(",") + "\n\r");
    console.log("Description:");
    console.log(taskTable.toString());
  });

};
