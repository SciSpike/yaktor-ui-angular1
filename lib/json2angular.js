process.on('uncaughtException', function (err) {
  console.log(err.stack);
});
var async = require('async');
/*
 * ---------------- ------------------- GLOBAL VARIABLES -------------------
 * ----------------
 */
var fs = require('fs'),
	path = require('path'),
	cp = require('child_process'),
	compileDebug = true,
	ansi = require('ansi'),
	cursor = ansi(process.stdout),
	S = require('string'),
	underscore = require('underscore'),
	which = require('which'),
	tv4 = require('tv4'),
	dummyRenderer = function (s, d) {
		return s;
	},
	json2angular = {},
	templates = {};

/*
 * ---------------- ------------------- RENDER CONTENT WITH OR WITHOUT HTML
 * TEMPLATING (UNDERSCORE) ------------------- ----------------
 */
  
function mergeTemplateAndModel (source, data) {
  var renderer = data ? underscore.template : dummyRenderer;
  return renderer(source, data);
}
  
function getTemplateContents (filename, data) {
  var renderer = data ? underscore.template : dummyRenderer;
  // CHECK TO SEE IF templates IS IN CACHE
  var source = templates[filename],
  	  filepath = path.join(__dirname, '..', 'template', filename);
  if (!source) {
    source = templates[filename] = fs.readFileSync(filepath, 'utf8');
  }
  if (data) {
    data.filename = filepath;
  }
  return renderer(source, data);
}

function getUnrenderedTemplateContents (filename) {
  // CHECK TO SEE IF templates IS IN CACHE
  var source = templates[filename],
  	  filepath = path.join(__dirname, '..', 'template', filename);
  if (!source) {
    source = templates[filename] = fs.readFileSync(filepath, 'utf8');
  }

  return source;
}
/*
 * ---------------- ------------------- WRITE TEMPLATE TO LOCATION
 * ------------------- ----------------
 */
function createTemplate (appname, filename, data) {
  if (data) {
    data.appname = appname;
  }
  var content = getTemplateContents(filename, data);
  var ext = path.extname(filename);
  fs.writeFileSync(path.join(appname, filename), content);
};

/*
 * ---------------- ------------------- CREATE FOLDER STRUCTURE REQUIRED FOR
 * EVERY ENGINE-UI PROJECT ------------------- ----------------
 */
function createScaffold (appname) {
  !fs.existsSync(appname) && fs.mkdirSync(appname);
  var projectPath = path.join(__dirname, appname);
  [ 'generated', 'generated/modules', 'generated/crud', 'generated/agents', 'generated/controllers', 'generated/directives', 'generated/services', 'generated/locale', 'gruntTasks', 'libs', 'libs/vendor', 'styles', 'styles/css', 'generated/partials', 'generated/partials/crud', 'generated/partials/agents','shared', 'shared/modules', 'client', 'cordova_template' ]
      .forEach(function (directory) {
        var appDirectory = path.join(appname, directory);
        !fs.existsSync(appDirectory) && fs.mkdirSync(appDirectory);
      }, this);
  var customGruntFile = path.join(appname, 'Gruntfile_custom.js')
  !fs.existsSync(customGruntFile) && createTemplate(appname, 'Gruntfile_custom.js');
  // CHANGE BELOW TO MERGE ORIGINAL AND EXISTING TO ENSURE WE HAVE BASE AND
  // EXTENDED COMBINED
  // BE CAREFUL ABOUT VERSIONING AND OTHER MODULE DEPENDENCIES
  var packageJson = path.join(appname, 'package.json');
  createTemplate(appname, 'package.json.req');
  !fs.existsSync(packageJson) && fs.renameSync(packageJson + '.req', packageJson);

  var bowerJson = path.join(appname, 'bower.json');
  createTemplate(appname, 'bower.json.req');
  !fs.existsSync(bowerJson) && fs.renameSync(bowerJson + '.req', bowerJson);
};

/*
 * ---------------- ------------------- LOCALE -------------------
 * ----------------
 */

var flattenedTitles = [];
var localeValues = [];

var flattenTitles = function (localeValue) {
  var inArray = localeValues.indexOf(localeValue);
  var key = '_' + localeValue.replace(/\s/g, '.').toUpperCase();
  if (inArray == -1) {
    localeValues.push(localeValue);
    flattenedTitles.push({
      key : key,
      value : localeValue
    });
  }
  return key;
}

function createLocale (appname) {
  var locale = process.env.LANG ? process.env.LANG.replace(/\..*/, "") : "en_US";
  createTemplate(appname, path.join('generated', 'locale', 'locale.js'), {
    keys : flattenedTitles,
    locale : locale
  });
  var oldPath = path.join(appname, 'generated', 'locale', 'locale.js');
  var newPath = path.join(appname, 'generated', 'locale', locale + '.js');
  fs.renameSync(oldPath, newPath);
}

/*
 * ---------------- ------------------- TRANSLATE TITLES -------------------
 * ----------------
 */

function translateUiTitles (elements) {
  if (elements.title && typeof elements.title == 'string') {
    elements.title = flattenTitles(elements.title);
  }
  if (elements.elements) {
    translateUiTitles(elements.elements);
  }
  for (section in elements) {
    if (elements[section].ui) {
      var sectionTitle = elements[section].ui.title;
      elements[section].ui.title = flattenTitles(sectionTitle);
    }
    if (elements[section].components) {
      translateUiTitles(elements[section].components.elements);
    }
  }
  return elements;
}

/*
 * ---------------- ------------------- CREATE AGENT CHILD STATES
 * ------------------- ----------------
 */

function createAgentChildState (appname, moduleName, state, parentStateName, moduleUrl) {
	  var controllerPath = path.join(appname, 'generated', 'agents', moduleName, 'controllers'),
	  	  partialPath = path.join(appname, 'generated', 'partials', 'agents', moduleName);
	  
	  state['name'] = state.subPath.replace('/', '');
	  
	  fs.mkdir(path.join(controllerPath, parentStateName), function (response) {
	    createTemplate(appname, path.join('generated', 'agents', 'agentChildController.js'), {
	      moduleName : moduleName,
	      state : state
	    });
	    var oldControllerPath = path.join(appname, 'generated', 'agents', 'agentChildController.js'),
	    	newControllerPath = path.join(controllerPath, parentStateName, state.name + '.js');
	    fs.renameSync(oldControllerPath, newControllerPath);
	  });
	  
	  fs.mkdir(path.join(partialPath, parentStateName), function (response) {
	    createTemplate(appname, path.join('generated', 'agents', 'agentChild.html'), {
	      moduleName : moduleName,
	      parentStateName : parentStateName,
	      state : state,
	      moduleUrl: moduleUrl,
	      
	    });
	    
	    var oldHtmlPath = path.join(appname, 'generated', 'agents', 'agentChild.html'), newHtmlPath = path.join(partialPath,
	        parentStateName, state.name + '.html');
	    fs.renameSync(oldHtmlPath, newHtmlPath);
	  });
}

/*
 * ---------------- ------------------- CREATE AGENT STATES
 * ------------------- ----------------
 */

function createAgentState (appname, moduleName, state, parentUrl) {
	
	  createTemplate(appname, path.join('generated', 'agents', 'agentController.js'), {
	    moduleName : moduleName,
	    state : state,
	    parentUrl : parentUrl
	  });
	  
	  var oldControllerPath = path.join(appname, 'generated', 'agents', 'agentController.js'),
	  	  newControllerPath = path.join(appname,'generated', 'agents', moduleName, 'controllers', state.name + '.js');
	  
	  fs.renameSync(oldControllerPath, newControllerPath);
	  if (state.elements) {
	    for (childState in state.elements) {
	      createAgentChildState(appname, moduleName, state.elements[childState], state.name, parentUrl);
	    }
	  }
	  
	  createTemplate(appname, path.join('generated', 'agents', 'agent.html'), {
	    moduleName : moduleName,
	    state : state,
	    parentUrl: parentUrl
	  });
	  
	  var oldHtmlPath = path.join(appname, 'generated', 'agents', 'agent.html'),
	  	  newHtmlPath = path.join(appname, 'generated', 'partials', 'agents', moduleName, state.name + '.html');
	  fs.renameSync(oldHtmlPath, newHtmlPath);
}

/*
 * ---------------- ------------------- CREATE AGENT -------------------
 * ----------------
 */

function createAgent (appname, masterSpec, moduleSpec, cb) {
	
  fs.mkdir(path.join(path.resolve(appname), 'generated', 'agents', moduleSpec.name), function (response) {
	    createTemplate(appname, path.join('generated', 'agents', 'agentModule.js'), {
	      moduleName : moduleSpec.name,
	      states : moduleSpec.states
	    });
	    
	    var oldPath = path.join(appname, 'generated', 'agents', 'agentModule.js'),
	    	newPath = path.join(appname, 'generated', 'agents', moduleSpec.name, moduleSpec.name + '.js');
	    fs.renameSync(oldPath, newPath);
	
	    // CREATE THE AGENT MAIN CONTROLLER
	    fs.mkdir(path.join(path.resolve(appname), 'generated', 'agents', moduleSpec.name, 'controllers'), function (response) {
	      createTemplate(appname, path.join('generated', 'agents', 'agentMasterController.js'), {
	        moduleName : moduleSpec.name,
	        actions : moduleSpec.actions,
	        states : moduleSpec.states
	      });
	      var oldControllerPath = path.join(appname, 'generated', 'agents', 'agentMasterController.js'),
	      	  newControllerPath = path.join(appname, 'generated', 'agents', moduleSpec.name, 'controllers', moduleSpec.name + '.js');
	      fs.renameSync(oldControllerPath, newControllerPath);
	
	      // CREATE THE MODULE INIT STATE CONTROLLER AND PARTIAL
	      fs.mkdir(path.join(path.resolve(appname), 'generated', 'partials', 'agents', moduleSpec.name), function (response) {
	        createTemplate(appname, path.join('generated', 'index.html'), {});
	        
	        var oldHtmlPath = path.join(appname, 'generated', 'index.html'),
	        	newHtmlPath = path.join(appname, 'generated', 'partials', 'agents', moduleSpec.name, 'index.html');
	        fs.renameSync(oldHtmlPath, newHtmlPath);
	        
	        if (moduleSpec.actions.elements) {
	          for (childState in moduleSpec.actions.elements) {
	            var state = {
	              title : moduleSpec.actions.elements[childState].ui.title,
	              components : moduleSpec.actions.elements.init.components,
	              initConversation : true
	            }
	            createAgentChildState(appname, moduleSpec.name, moduleSpec.actions.elements[childState], '',  moduleSpec.actions.url);
	          }
	        }
	        // CREATE THE MODULE CHILD STATES
	        if (moduleSpec.states) {
	          for (var i = moduleSpec.states.length - 1; i >= 0; i--) {
	            moduleSpec.states[i] = translateUiTitles(moduleSpec.states[i]);
	            createAgentState(appname, moduleSpec.name, moduleSpec.states[i], moduleSpec.actions.url);
	          }
	        }
	        moduleSpec.actions.elements = translateUiTitles(moduleSpec.actions.elements);
	        fs.mkdir(path.join(path.resolve(appname), 'generated', 'agents', moduleSpec.name, 'services'), function (response) {
	          createTemplate(appname, path.join('generated', 'agents', 'agentServices.js'), {
	            moduleName : moduleSpec.name,
	            actions : moduleSpec.actions,
	            states : moduleSpec.states,
	            agentSpec: masterSpec.agents 
	          });
	          var oldServicePath = path.join(appname, 'generated', 'agents', 'agentServices.js'),
	          	  newServicePath = path.join(appname, 'generated', 'agents', moduleSpec.name, 'services', moduleSpec.name + 'Services.js');
	          fs.renameSync(oldServicePath, newServicePath);
	          cb();
	        });
	      });
	    });
	  });
}

/*
 * ---------------- ------------------- CREATE CRUD STATES
 * ------------------- ----------------
 */

function createCrudState (appname, masterSpec, moduleName, state, parentStateName, moduleUrl, agents) {
	var controllerPath = path.join(appname, 'generated', 'crud', parentStateName, 'controllers'),
		partialPath = path.join(appname, 'generated', 'partials', 'crud', parentStateName),
		crudType;

	if (moduleName == 'POST' || moduleName == 'PUT') {
		crudType = 'postPut';
	}
	if(moduleName == 'FIND'){
		crudType = 'find';
	}
	if(moduleName == 'GET' || moduleName == 'DELETE'){
		crudType = 'get';
	}

	var specModel = {
		parentStateName : parentStateName,
		moduleName : moduleName,
		state : state,
		agents : agents,
		agentSpec: masterSpec.agents,
		crudAgent: crudAgent
	};
	var crudAgent = getUnrenderedTemplateContents(path.join('generated', 'crud', 'crudAgents.js'));
	var contents = getUnrenderedTemplateContents(path.join('generated', 'crud', crudType + 'Controller.js'));
	var controllerContents = mergeTemplateAndModel(contents, specModel);
  var agentControllerContents = mergeTemplateAndModel(crudAgent, specModel);

	createTemplate(appname, path.join('generated', 'crud', 'crudController.js'), {
		parentStateName : parentStateName,
		moduleName : moduleName,
		state : state,
		agents : agents,
		agentSpec: masterSpec.agents,
		crudControllerContents: controllerContents
	});
  
  var oldControllerPath = path.join(appname, 'generated', 'crud', 'crudController.js'),
  	newControllerPath = path.join(controllerPath, moduleName + '.js');
  fs.renameSync(oldControllerPath, newControllerPath);

  if (agents.length){
  	createTemplate(appname, path.join('generated', 'crud', 'crudAgentController.js'), {
  		parentStateName : parentStateName,
  		moduleName : moduleName,
  		state : state,
  		agents : agents,
  		agentSpec: masterSpec.agents,
  		crudControllerContents: agentControllerContents
  	});
    
    var oldControllerPath = path.join(appname, 'generated', 'crud', 'crudAgentController.js'),
    	newControllerPath = path.join(controllerPath, parentStateName + 'AgentController.js');
    fs.renameSync(oldControllerPath, newControllerPath);
  }

	createTemplate(appname, path.join('generated', 'crud', crudType + '.html'), {
		moduleName : moduleName,
		parentStateName : parentStateName,
		state : state,
		moduleUrl: moduleUrl,
		agents: agents,
		agentSpec: masterSpec.agents //bringing the spec along for the ride for now
	});

	var oldHtmlPath = path.join(appname, 'generated', 'crud', crudType + '.html'),
		newHtmlPath = path.join(partialPath, moduleName + '.html');
	fs.renameSync(oldHtmlPath, newHtmlPath);
}

/*
 * ---------------- ------------------- CREATE CRUD -------------------
 * ----------------
 */

function createCrud (appname, masterSpec, crudSpec, cb) {
	  fs.mkdir(path.join(path.resolve(appname), 'generated', 'crud', crudSpec.name), function (response) {
	    createTemplate(appname, path.join('generated', 'crud', 'crudModule.js'), {
	      moduleName : crudSpec.name,
	      states : crudSpec.actions.elements,
	      agents: crudSpec.agents,
	      agentSpec: masterSpec.agents
	    });
	    
	    var oldPath = path.join(appname, 'generated', 'crud', 'crudModule.js'),
	    	newPath = path.join(appname, 'generated', 'crud', crudSpec.name, crudSpec.name + '.js');
	    fs.renameSync(oldPath, newPath);
	    
	    fs.mkdir(path.join(path.resolve(appname), 'generated', 'crud', crudSpec.name, 'controllers'), function (response) {
	      createTemplate(appname, path.join('generated', 'crud', 'crudMasterController.js'), {
	        moduleName : crudSpec.name,
	        actions : crudSpec.actions
	      });
	      
	      var oldControllerPath = path.join(appname, 'generated', 'crud', 'crudMasterController.js'),
	      	  newControllerPath = path.join(appname, 'generated', 'crud', crudSpec.name, 'controllers', crudSpec.name + '.js');
	      fs.renameSync(oldControllerPath, newControllerPath);
	      
	      crudSpec.actions.elements = translateUiTitles(crudSpec.actions.elements);
	      
	      fs.mkdir(path.join(path.resolve(appname), 'generated', 'partials', 'crud', crudSpec.name), function (response) {
	        createTemplate(appname, path.join('generated', 'index.html'), {});
	        
	        var oldHtmlPath = path.join(appname, 'generated', 'index.html'),
	        	newHtmlPath = path.join(appname, 'generated', 'partials', 'crud', crudSpec.name, 'index.html');
	        fs.renameSync(oldHtmlPath, newHtmlPath);
	        
	        if (crudSpec.actions.elements) {
	          for (childState in crudSpec.actions.elements) {
	            var state = {
	              title : crudSpec.actions.elements[childState].ui.title,
	              components : crudSpec.actions.elements[childState].components
	            }
	            createCrudState(appname, masterSpec, childState, crudSpec.actions.elements[childState], crudSpec.name, crudSpec.actions.url, crudSpec.agents);
	          }
	        }
	        fs.mkdir(path.join(path.resolve(appname), 'generated', 'crud', crudSpec.name, 'services'), function (response) {
	          createTemplate(appname, path.join('generated', 'crud', 'crudServices.js'), {
	            moduleName : crudSpec.name,
	            actions : crudSpec.actions,
	            agents: crudSpec.agents,
	            agentSpec: masterSpec.agents 
	            
	          });
	          var oldServicePath = path.join(appname, 'generated', 'crud', 'crudServices.js'),
	          	  newServicePath = path.join(appname, 'generated', 'crud', crudSpec.name, 'services', crudSpec.name + 'Services.js');
	          fs.renameSync(oldServicePath, newServicePath);
	        });
	        cb();
	      });
	
	    });
	
	  });

}

/*
 * ---------------- ------------------- CREATE APP -------------------
 * ----------------
 */

function createApp (appname, spec, cb, resourceModules) {
	  var moduleNames = resourceModules;
	  async.parallel([ function (cb) {
	    async.each(spec.agents, function (agent, cb) {
	      moduleNames.push(agent.name);
	      createAgent(appname, spec, agent, cb);
	    }, cb);
	  }, function (cb) {
	    async.each(spec.crud, function (crud, cb) {
	      var crudName = crud.name;
	      if (crudName.charAt(0) == '/') {
	        crudName = crudName.substr(1);
	      }
	      crud.name = crudName.replace(/\//g, '_');
	      moduleNames.push(crud.name);
	      createCrud(appname, spec, crud, cb);
	    }, cb);
	  }, function (cb) {
	    createTemplate(appname, 'app.js', {
	      moduleNames : moduleNames,
	      agents : spec.agents
	    });
	    cb();
	  }, function (cb) {
	    createTemplate(appname, 'appConfig.js', {
	      moduleNames : moduleNames,
	      agents : spec.agents
	    });
	    cb();
	  } ], function (err) {
	    fs.mkdir(path.join(path.resolve(appname), 'generated', 'locale'), function (response) {
	      createLocale(appname);
	      cb();
	    });
	  });

}

/*
 * ---------------- ------------------- CREATE PROJECT -------------------
 * ----------------
 */
function isDirectory (folderPath) {
	return fs.lstatSync(folderPath).isDirectory();
}

function recursiveFolderLoop (appname, folderPath, folder, data, cb) {
	  var data = data;
	  fs.mkdir(path.join(path.resolve(appname), folderPath, folder), function (response) {
	    var files = fs.readdirSync(path.join(__dirname, '../', 'template', folderPath, folder));
	    async.each(files, function (file, cb) {
	      var checkIfDirectory = isDirectory(path.join(__dirname, '../', 'template', folderPath, folder, file));
	      if (checkIfDirectory) {
	        var folderPathNew = path.join(folderPath, folder);
	        recursiveFolderLoop(appname, folderPathNew, file, data, cb);
	      } else {
	        createTemplate(appname, path.join(folderPath, folder, file), data);
	        cb();
	      }
	    }, cb);
	  });
}

function checkIfFolder (appname, folderName, file, data, cb) {
	  var checkIfDirectory = isDirectory(path.join(__dirname, '../', 'template', folderName, file));
	  if (checkIfDirectory) {
	    recursiveFolderLoop(appname, folderName, file, data, cb);
	  } else {
	    createTemplate(appname, path.join(folderName, file), data);
	    cb();
	  }
}

json2angular.create = function (spec, cb) {
  var appname = new S(spec.name).camelize().s, isNew = !fs.existsSync(appname), theme;
  createScaffold(appname);
  createTemplate(appname, 'README.md');

  var baseIndex = path.join(appname, 'index.html')
  !fs.existsSync(baseIndex) && createTemplate(appname, 'index.html');
  
  if (isNew) {
    var files = fs.readdirSync(path.join(__dirname, '../', 'template', 'client'));
    async.each(files, function (file, cb) {
      checkIfFolder(appname, 'client', file, {
        moduleNames : {}
      }, cb);
    }, cb);
  } else {
    cb();
  }

}

function createProject (spec, cb) {
	  var appname = new S(spec.name).camelize().s, isNew = !fs.existsSync(appname), theme;
	  var moduleNames = {
	    crud : [],
	    agents : [],
	    resources:[]
	  };
	  for ( var module in spec.modules) {
	    for (var i = spec.modules[module].length - 1; i >= 0; i--) {
	      moduleNames[module].push(spec.modules[module][i].name.split('/').slice(-1)[0]);
	    }
	  }
	  var locale = process.env.LANG ? process.env.LANG.replace(/\..*/, "") : "en_US";
	  var moduleData = {
	    moduleNames : moduleNames,
	    locale : locale,
	    fullSpec: spec
	  };
	  createTemplate(appname, path.join('Gruntfile.js'), moduleData);
	  async.series([
			function (cb) {
				var files = fs.readdirSync(path.join(__dirname, '../', 'template', 'generated', 'controllers'));
				async.each(files, function (file, cb) {
					checkIfFolder(appname, 'generated/controllers', file, moduleData, cb);
				}, cb);
			},
			function (cb) {
				var files = fs.readdirSync(path.join(__dirname, '../', 'template', 'generated', 'directives'));
				async.each(files, function (file, cb) {
					checkIfFolder(appname, 'generated/directives', file, moduleData, cb);
				}, cb);
			},
			function (cb) {
				var files = fs.readdirSync(path.join(__dirname, '../', 'template', 'generated', 'services'));
				async.each(files, function (file, cb) {
					checkIfFolder(appname, 'generated/services', file, moduleData, cb);
				}, cb);
			},
			function (cb) {
				var files = fs.readdirSync(path.join(__dirname, '../', 'template', 'generated', 'modules'));
				async.each(files, function (file, cb) {
					checkIfFolder(appname, 'generated/modules', file, moduleData, cb);
				}, cb);
			},
			function (cb) {
				var files = fs.readdirSync(path.join(__dirname, '../', 'template', 'shared', 'modules'));
				async.each(files, function (file, cb) {
					checkIfFolder(appname, 'shared/modules', file, moduleData, cb);
				}, cb);
			},
			function (cb) {
				fs.readFile(path.join(appname, 'client', 'setup.json'), 'utf-8', function (err, content) {
					if (err) {
						console.log(err);
					}
					theme = JSON.parse(content).theme;
					moduleNames.resources = JSON.parse(content).modules;
					cb();
				});
			},
			function (cb) {
				var files = fs.readdirSync(path.join(__dirname, '../', 'template', 'gruntTasks'));
				async.each(files, function (file, cb) {
					checkIfFolder(appname, 'gruntTasks', file, {
						moduleNames : moduleNames,
						locale : locale,
						theme : theme
					}, cb);
				}, cb);
			},
			function (cb) {
				var files = fs.readdirSync(path.join(__dirname, '../', 'template', 'libs'));
				async.each(files, function (file, cb) {
					checkIfFolder(appname, 'libs', file, null, cb);
				}, cb);
			},
			function (cb) {
				var files = fs.readdirSync(path.join(__dirname, '../', 'template', 'generated', 'partials'));
				async.each(files, function (file, cb) {
					checkIfFolder(appname, 'generated/partials', file, null, cb);
				}, cb);
			},
			function (cb) {
				var files = fs.readdirSync(path.join(__dirname, '../', 'template', 'cordova_template'));
				async.each(files, function (file, cb) {
					checkIfFolder(appname, 'cordova_template', file, null, cb);
				}, cb);
			},
			function (cb) {
	    	createApp(appname, spec.modules, cb, moduleNames.resources);
	  	} ], cb)

}

// This function is the main driver that is executed by the `json2angular`
// binary.
json2angular.exec = function (spec, cb) {
  createProject(spec, cb);
};

module.exports = json2angular;
