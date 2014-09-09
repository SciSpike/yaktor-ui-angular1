process.on('uncaughtException', function(err) {
  console.log(err.stack);
});

/* ----------------
-------------------
GLOBAL VARIABLES
-------------------
---------------- */
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
		dummyRenderer = function(s,d){
		  return s;
		},
		json2angular = {},
		templates ={},
		copyFiles;

/* ----------------
-------------------
RENDER CONTENT WITH OR WITHOUT HTML TEMPLATING (UNDERSCORE)
-------------------
---------------- */
	function getTemplateContents(filename,data){
		var renderer = data?underscore.template:dummyRenderer;
		//CHECK TO SEE IF templates IS IN CACHE
		var source = templates[filename],
			filepath = path.join(__dirname, '..', 'template', filename);
		if(!source){
			source = templates[filename] = fs.readFileSync(filepath, 'utf8');
		}
		if(data){
			data.filename=filepath;
		}
		return renderer(source, data);
	}

/* ----------------
-------------------
WRITE TEMPLATE TO LOCATION
-------------------
---------------- */
	function createTemplate(appname, filename, data) {
		if(data){
			data.appname = appname;
		}
		var content = getTemplateContents(filename,data);
		var ext = path.extname(filename);
		fs.writeFileSync(path.join(appname, filename), content);
	};

/* ----------------
-------------------
 CREATE FOLDER STRUCTURE REQUIRED FOR EVERY ENGINE-UI PROJECT
-------------------
---------------- */
	function createScaffold(appname) {
		!fs.existsSync(appname) && fs.mkdirSync(appname);
		var projectPath = path.join(__dirname, appname);
		[ 'modules',
		  'modules/crud',
		  'shared',
		  'shared/controllers',
		  'shared/directives',
		  'shared/services',
		  'shared/locale',,
		  'gruntTasks',
		  'libs',
		  'libs/vendor',
		  'styles',
		  'styles/less',
		  'styles/css',
		  'partials',
		  'partials/crud',
		  'clientConfig']
		.forEach(
				function(directory) {
					var appDirectory = path.join(appname, directory)
					!fs.existsSync(appDirectory) && fs.mkdirSync(appDirectory);
				}, this);
		var customGruntFile = path.join(appname, 'Gruntfile_custom.js')
			!fs.existsSync(customGruntFile) && createTemplate(appname, 'Gruntfile_custom.js');
		//CHANGE BELOW TO MERGE ORIGINAL AND EXISTING TO ENSURE WE HAVE BASE AND EXTENDED COMBINED
		//BE CAREFUL ABOUT VERSIONING AND OTHER MODULE DEPENDENCIES
		var packageJson = path.join(appname, 'package.json');
		createTemplate(appname, 'package.json.req');
		!fs.existsSync(packageJson) && fs.renameSync(packageJson + '.req', packageJson);
		  
		var bowerJson = path.join(appname, 'bower.json');
		createTemplate(appname, 'bower.json.req');
		!fs.existsSync(bowerJson) && fs.renameSync(bowerJson + '.req', bowerJson);
	};
	
/* ----------------
-------------------
LOCALE
-------------------
---------------- */	
	
	var flattenedTitles = [];	
	
	var flattenTitles = function(localeValue){
		var key = '_' + localeValue.replace(/\s/g, '.').toUpperCase();
		flattenedTitles.push({
			key:key,
			value:localeValue
		});
		return key;
	}
	
	function createLocale(appname, moduleName){
		var locale = process.env.LANG?process.env.LANG.replace(/\..*/,""):"en_US";
		createTemplate(appname, path.join('modules', 'locale.js'), {
			moduleName:moduleName,
		    keys:flattenedTitles,
		    locale:locale
		});
		var oldPath = path.join(appname, 'modules', 'locale.js');
		var newPath = path.join(appname, 'modules', moduleName, 'locale', locale+'.js');
		fs.renameSync(oldPath, newPath);
	}
	
/* ----------------
-------------------
TRANSLATE TITLES
-------------------
---------------- */
	
	function translateUiTitles(elements){
		for(section in elements){
			var sectionTitle = elements[section].ui.title;
			elements[section].ui.title = flattenTitles(sectionTitle);
			for(element in elements[section].components.elements){
				var elementTitle = elements[section].components.elements[element].ui.title;
				elements[section].components.elements[element].ui.title = flattenTitles(elementTitle);
			}
		}
		return elements;
	}

/* ----------------
-------------------
CREATE STATES AND CHILD STATES
-------------------
---------------- */
	
	function createCrudState(appname, moduleName, state, parentStateName){
		var controllerPath =  path.join(appname, 'modules', 'crud', parentStateName, 'controllers'),
			partialPath =  path.join(appname, 'partials', 'crud', parentStateName);
		createTemplate(appname, path.join('modules', 'crudController.js'), {
			parentStateName: parentStateName,
			moduleName: moduleName,
			state: state
		});
		var oldControllerPath = path.join(appname, 'modules', 'crudController.js'),
			newControllerPath = path.join(controllerPath, moduleName + '.js');
		fs.renameSync(oldControllerPath, newControllerPath);
		if(moduleName == 'POST' || moduleName == 'PUT'){
			var partialType = 'actionable';
		}else{
			var partialType = 'find';
		}
		createTemplate(appname, path.join('modules', partialType + '.html'), {
			moduleName: moduleName,
			parentStateName: parentStateName,
			state: state
		});
		var oldHtmlPath = path.join(appname, 'modules', partialType + '.html'),
			newHtmlPath = path.join(partialPath, moduleName + '.html');
		fs.renameSync(oldHtmlPath, newHtmlPath);
	}
	
	function createAgentChildState(appname, moduleName, state, parentStateName){
		var controllerPath =  path.join(appname, 'modules', moduleName, 'controllers'),
			partialPath =  path.join(appname, 'partials', moduleName);
		state['name'] = state.subPath.replace('/', '');
		fs.mkdir(path.join(controllerPath, parentStateName), function(response){
			createTemplate(appname, path.join('modules', 'actionableController.js'), {
				moduleName: moduleName,
				state: state
			});
			var oldControllerPath = path.join(appname, 'modules', 'actionableController.js'),
				newControllerPath = path.join(controllerPath, parentStateName, state.name + '.js');
			fs.renameSync(oldControllerPath, newControllerPath);
		});
		fs.mkdir(path.join(partialPath, parentStateName), function(response){
			createTemplate(appname, path.join('modules', 'actionable.html'), {
				moduleName: moduleName,
				parentStateName: parentStateName,
				state: state
			});
			var oldHtmlPath = path.join(appname, 'modules', 'actionable.html'),
				newHtmlPath = path.join(partialPath, parentStateName, state.name + '.html');
			fs.renameSync(oldHtmlPath, newHtmlPath);
		});
	}
	
	function createAgentState(appname, moduleName, state, parentUrl) {
		createTemplate(appname, path.join('modules', 'agentController.js'), {
			moduleName: moduleName,
			state: state,
			parentUrl: parentUrl
		});
		var oldControllerPath = path.join(appname, 'modules', 'agentController.js'),
			newControllerPath = path.join(appname, 'modules', moduleName, 'controllers', state.name + '.js');
		fs.renameSync(oldControllerPath, newControllerPath);
		state.title = flattenTitles(state.title);
		if(state.elements){
			state.elements = translateUiTitles(state.elements);
			for(childState in state.elements){
				createAgentChildState(appname, moduleName, state.elements[childState], state.name);
			}
		}
		createTemplate(appname, path.join('modules', 'state.html'), {
			moduleName: moduleName,
			state: state
		});
		var oldHtmlPath = path.join(appname, 'modules', 'state.html'),
			newHtmlPath = path.join(appname, 'partials', moduleName, state.name + '.html');
		fs.renameSync(oldHtmlPath, newHtmlPath);
	}
	
/* ----------------
-------------------
CREATE AGENT
-------------------
---------------- */
	
	function createAgent(appname, moduleSpec) {
		fs.mkdir(path.join(path.resolve(appname), 'modules', moduleSpec.name), function(response){
			flattenedTitles = [];
			createTemplate(appname, path.join('modules', 'agentModule.js'), {
				moduleName: moduleSpec.name,
				states: moduleSpec.states
			});
			var oldPath = path.join(appname, 'modules', 'agentModule.js'),
				newPath = path.join(appname, 'modules', moduleSpec.name, moduleSpec.name + '.js');
			fs.renameSync(oldPath, newPath);
			
			//CREATE THE AGENT MAIN CONTROLLER
			fs.mkdir(path.join(path.resolve(appname), 'modules', moduleSpec.name, 'controllers'), function(response){
				createTemplate(appname, path.join('modules', 'agentMasterController.js'), {
					moduleName: moduleSpec.name,
					actions: moduleSpec.actions
				});
				var oldControllerPath = path.join(appname, 'modules', 'agentMasterController.js'),
					newControllerPath = path.join(appname, 'modules', moduleSpec.name, 'controllers', moduleSpec.name + '.js');
				fs.renameSync(oldControllerPath, newControllerPath);
			});
			
			//CREATE THE MODULE INIT STATE CONTROLLER AND PARTIAL
			fs.mkdir(path.join(path.resolve(appname), 'partials', moduleSpec.name), function(response){
				createTemplate(appname, path.join('modules', 'index.html'), {
				});
				var oldHtmlPath = path.join(appname, 'modules', 'index.html'),
					newHtmlPath = path.join(appname, 'partials', moduleSpec.name, 'index.html');
				fs.renameSync(oldHtmlPath, newHtmlPath);
				if(moduleSpec.actions.elements){
					for(childState in moduleSpec.actions.elements){
						var state = {
								title: moduleSpec.actions.elements[childState].ui.title,
								components: moduleSpec.actions.elements.init.components,
								initConversation: true
						}
						state.title = flattenTitles(state.title);
						createAgentChildState(appname, moduleSpec.name, moduleSpec.actions.elements[childState], '');
					}
				}
			});
			
			//CREATE THE MODULE CHILD STATES
			if(moduleSpec.states){
				for(var i=moduleSpec.states.length-1; i>=0; i--){
					createAgentState(appname, moduleSpec.name, moduleSpec.states[i], moduleSpec.actions.url);
				}
			}
			
			fs.mkdir(path.join(path.resolve(appname), 'modules', moduleSpec.name, 'locale'), function(response){
				createLocale(appname, moduleSpec.name);
			});
			fs.mkdir(path.join(path.resolve(appname), 'modules', moduleSpec.name, 'services'), function(response){});
		});
	}
	
/* ----------------
-------------------
CREATE CRUD
-------------------
---------------- */
	
function createCrud(appname, crudSpec) {
	fs.mkdir(path.join(path.resolve(appname), 'modules', 'crud', crudSpec.name), function(response){
		createTemplate(appname, path.join('modules', 'crudModule.js'), {
			moduleName: crudSpec.name,
			states: crudSpec.actions.elements
		});
		var oldPath = path.join(appname, 'modules', 'crudModule.js'),
			newPath = path.join(appname, 'modules', 'crud', crudSpec.name, crudSpec.name + '.js');
		fs.renameSync(oldPath, newPath);
	});
	
	//CREATE THE CRUD MAIN CONTROLLER
	fs.mkdir(path.join(path.resolve(appname), 'modules', 'crud', crudSpec.name, 'controllers'), function(response){
		createTemplate(appname, path.join('modules', 'crudMasterController.js'), {
			moduleName: crudSpec.name,
			actions: crudSpec.actions
		});
		var oldControllerPath = path.join(appname, 'modules', 'crudMasterController.js'),
			newControllerPath = path.join(appname, 'modules', 'crud', crudSpec.name, 'controllers', crudSpec.name + '.js');
		fs.renameSync(oldControllerPath, newControllerPath);
	});
	
	fs.mkdir(path.join(path.resolve(appname), 'partials', 'crud', crudSpec.name), function(response){
		createTemplate(appname, path.join('modules', 'index.html'), {
		});
		var oldHtmlPath = path.join(appname, 'modules', 'index.html'),
			newHtmlPath = path.join(appname, 'partials', 'crud', crudSpec.name, 'index.html');
		fs.renameSync(oldHtmlPath, newHtmlPath);
		if(crudSpec.actions.elements){
			for(childState in crudSpec.actions.elements){
				var state = {
						title: crudSpec.actions.elements[childState].ui.title,
						components: crudSpec.actions.elements[childState].components
				}
				state.title = flattenTitles(state.title);
				createCrudState(appname, childState, crudSpec.actions.elements[childState], crudSpec.name);
			}
		}
	});
	
	fs.mkdir(path.join(path.resolve(appname), 'modules', 'crud', crudSpec.name, 'services'), function(response){
		createTemplate(appname, path.join('modules', 'services.js'), {
			moduleName: crudSpec.name,
			actions: crudSpec.actions
		});
		var oldServicePath = path.join(appname, 'modules', 'services.js'),
			newServicePath = path.join(appname, 'modules', 'crud', crudSpec.name, 'services', crudSpec.name + 'Services.js');
		fs.renameSync(oldServicePath, newServicePath);
	});
}
	
/* ----------------
-------------------
CREATE APP
-------------------
---------------- */
	
	function createApp(appname, spec) {
		//create master module file
		//create master config
		//create controllers/mainController.js ??? IF THIS HAS CONTENT GENERATED FROM SPEC ???
		//create services/mainServices.js ??? IF THIS HAS CONTENT GENERATED FROM SPEC ???
		//create locale/en_US.js
		var moduleNames = [];
		for(var i=spec.agents.length-1; i>=0; i--){
			moduleNames.push(spec.agents[i].name);
			createAgent(appname, spec.agents[i]);
		}
		for(var i=spec.crud.length-1; i>=0; i--){
			var crudName = spec.crud[i].name;
			if(crudName.charAt(0) == '/'){
				crudName = crudName.substr(1);
			}
			spec.crud[i].name = crudName.replace(/\//g,'_');
			moduleNames.push(spec.crud[i].name);
			createCrud(appname, spec.crud[i]);
		}
		createTemplate(appname, 'app.js', {moduleNames: moduleNames});
	}
	
/* ----------------
-------------------
CREATE PROJECT
-------------------
---------------- */
	function isDirectory(folderPath){
		return fs.lstatSync(folderPath).isDirectory();
	}
	
	function recursiveFolderLoop(appname, folderPath, folder, data){
		var data = data;
		fs.mkdir(path.join(path.resolve(appname), folderPath, folder), function(response){
			  	fs.readdirSync(path.join(__dirname, '../', 'template', folderPath, folder)).forEach(function(file) {
	  			  	var checkIfDirectory = isDirectory(path.join(__dirname, '../', 'template', folderPath, folder, file));
			  		if(checkIfDirectory){
			  			var folderPathNew = path.join(folderPath, folder);
			  			recursiveFolderLoop(appname, folderPathNew, file, data)
			  		}else{
			  			createTemplate(appname, path.join(folderPath, folder, file), data);
			  		}
			  	});
		 });
	}
	
	function checkIfFolder(appname, folderName, file, data){
		var checkIfDirectory = isDirectory(path.join(__dirname, '../', 'template', folderName, file));
    	if(checkIfDirectory){
    		recursiveFolderLoop(appname, folderName, file, data);
    	}else{
    		createTemplate(appname, path.join(folderName, file), data);
    	}
	}
	
	function createProject(spec) {
		var appname = new S(spec.name).camelize().s,
			isNew = !fs.existsSync(appname);
		createScaffold(appname);
		createTemplate(appname, 'README.md');
	    createTemplate(appname, 'index.html');
		copyFiles = function() { //CALLED FROM setupDependencies FUNCTION
			var moduleNames = {
					crud: [],
					agents: []
			};
			for(var module in spec.modules){
				for(var i=spec.modules[module].length-1; i>=0; i--){
					moduleNames[module].push(spec.modules[module][i].name.split('/').slice(-1)[0]);
				}
			}
			var moduleData = {moduleNames: moduleNames};
			
		    createTemplate(appname, path.join('Gruntfile.js'),moduleData);
		    fs.readdirSync(path.join(__dirname, '../', 'template', 'shared')).forEach(function(file) {
	        	checkIfFolder(appname, 'shared', file, moduleData)
	        });
	        fs.readdirSync(path.join(__dirname, '../', 'template', 'gruntTasks')).forEach(function(file) {
	        	checkIfFolder(appname, 'gruntTasks', file, moduleData)
	        });
	        fs.readdirSync(path.join(__dirname, '../', 'template', 'styles')).forEach(function(file) {
	        	checkIfFolder(appname, 'styles', file, null)
	    	});
	        fs.readdirSync(path.join(__dirname, '../', 'template', 'libs')).forEach(function(file) {
	        	checkIfFolder(appname, 'libs', file, null)
	  	    });
	        fs.readdirSync(path.join(__dirname, '../', 'template', 'partials')).forEach(function(file) {
	        	checkIfFolder(appname, 'partials', file, null) 
		    });
	        fs.readdirSync(path.join(__dirname, '../', 'template', 'clientConfig')).forEach(function(file) {
	        	fs.exists(path.join(appname, 'clientConfig', file), function(exists) {
	        		if (!exists) {
	        		    createTemplate(appname, path.join('clientConfig', file), moduleData);
	        		}
	        	});
			});
		}
		createApp(appname, spec.modules);
	    setupDependencies(appname);
	}
	
/* ----------------
-------------------
INSTALL NODE MODULES AND BOWER COMPONENTS
-------------------
---------------- */
	function setupDependencies(appname){
		exec('npm',['install'], path.resolve(appname),
			      function (error) {
			        if (error) {
			          console.log('exec error: ' + error);
			        } else {
			          exec('npm',['test'], path.resolve(appname),
			             function (error) {
			            if (error) {
			              console.log('exec error: ' + error);
			            }
			         });
			       }
			    });
			  
			  //replace setup.sh
			  exec("bower", ["install"],path.resolve(appname), function(error) {
			    if (error) {
			      console.log('exec error: ' + error);
			    } else {
			      exec("npm", ["install"],path.resolve(appname)+"/bower_components/sockjs-client/", function(error) {
			        if (error) {
			          console.log('exec error: ' + error);
			        } else {
			          exec("make", ["build"],path.resolve(appname)+"/bower_components/sockjs-client/", function(error) {
			            if (error) {
			              console.log('exec error: ' + error);
			            } else {
			            	copyFiles(); //EXISTS INSIDE createProject FUNCTION
			            }
			          });
			        }
			      });
			  }
		});
	}

	
	
	
/* ----------------
-------------------
START
-------------------
---------------- */
	function exec (cmd,args,cwd, cb){
		var proc = cp.spawn(which.sync(cmd), args||[],{cwd:cwd||path.resolve(appname), stdio: 'inherit' });
		if(cb){
			proc.on("close",cb)
		}
		return proc;
	}
	
	//This function is the main driver that is executed by the `json2angular` binary.
	json2angular.exec = function(spec) {
		createProject(spec);
	};
	
	module.exports = json2angular;