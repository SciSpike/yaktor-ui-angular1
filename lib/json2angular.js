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
		schemata = require('./schemata'),
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
		  'partials/crud']
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
CREATE CONTENTS - TBD DIRECTIVES INSTEAD???
-------------------
---------------- */
	function createContents(elements ,path){
		//TO DO
	}
	
/* ----------------
-------------------
FLATTEN TITLES - TO UPDATE THE META-MODEL WITH KEY NAMES FOR TRANSLATION AND ALSO BUILDS THE TRANSLATION FILES
-------------------
---------------- */
	var flattenTitles = function(flattenedTitles,element,path){
		path = path.replace(/\//g,"_")
		  var title = element.title || element.ui.title;
		  flattenedTitles.push({
		    key:path,
		    title:title
		  })
		  if(element.title){
		    element.title=path;
		  } else {
		    element.ui.title=path;
		  }
		  var elements = element.components?element.components.elements:element.elements;
		  if(elements){
		    Object.keys(elements).forEach(function(e){
		      var myPath = path +"."+e.toUpperCase();
		      var element =  elements[e];
		      flattenTitles(flattenedTitles,element,myPath);
		    }); 
		  }
		  elements = element.components?element.components.actions:null;
		  if(elements){
		    Object.keys(elements).forEach(function(e){
		      var myPath = path +"."+e.toUpperCase();
		      var element =  elements[e];
		      flattenTitles(flattenedTitles,element,myPath);
		    }); 
		 }
	}
	
/* ----------------
-------------------
CREATE STATE - TO DO
-------------------
---------------- */
	function createState(appname, moduleName, state) {
		var modulePath =  path.join(appname, 'modules', moduleName),
			partialPath =  path.join(appname, 'partials', moduleName),
		createTemplate(appname, path.join('modules', 'conversation', 'controllers', 'controller.js'), {
			moduleName: moduleName,
			state: state
		});
		createTemplate(appname, path.join('modules', 'conversation', 'partials', 'state.html'), {
			moduleName: moduleName,
			state: state
		});
		var oldControllerPath = path.join(appname, 'modules', 'conversation', 'controllers', 'controller.js'),
			newControllerPath = path.join(modulePath, 'controllers', state.name + '.js'),
			oldHtmlPath = path.join(appname, 'modules', 'conversation', 'partials', 'state.html'),
			newHtmlPath = path.join(partialPath, state.name + '.html');
		fs.renameSync(oldControllerPath, newControllerPath);
		fs.renameSync(oldHtmlPath, newHtmlPath);
	}
	
/* ----------------
-------------------
CREATE MODULE - TO DO
-------------------
---------------- */
	function createModule(appname, moduleSpec) {
		//create module file
		//create module config
		//create module/controllers folder
		//create module/services folder
		var flattenedTitles = [];
		fs.mkdir(path.join(path.resolve(appname), 'modules', moduleSpec.name), function(response){
			createTemplate(appname, path.join('modules', 'module.js'), {
				moduleName: moduleSpec.name,
				states: moduleSpec.states
			});
			var oldPath = path.join(appname, 'modules', 'module.js'),
				newPath = path.join(appname, 'modules', moduleName, moduleSpec.name + '.js');
			fs.renameSync(oldPath, newPath);
			
			fs.mkdir(path.join(path.resolve(appname), 'modules', moduleSpec.name, 'controllers'), function(response){}); //WHY path.resolve ???
			fs.mkdir(path.join(path.resolve(appname), 'modules', moduleSpec.name, 'locale'), function(response){});
			fs.mkdir(path.join(path.resolve(appname), 'modules', moduleSpec.name, 'services'), function(response){});
			fs.mkdir(path.join(path.resolve(appname), 'partials', moduleSpec.name), function(response){});
			
			for(var i=moduleSpec.states.length-1; i>=0; i--){
				createState(appname, moduleSpec.name, state);
				flattenTitles(flattenedTitles, moduleSpec.states[i], moduleSpec.name.toUpperCase());
			}
			var locale = process.env.LANG?process.env.LANG.replace(/\..*/,""):"en_US";
			createTemplate(appname, path.join('modules', 'conversation', 'locale', 'locale.js'), {
				title:moduleSpec.title,
			    keys:flattenedTitles.sort(function(e1,e2){
			      return e1.key.localeCompare(e2.key);
			    }),
			    locale:locale
			});
			var oldPath = path.join(appname, 'modules', 'conversation', 'locale', 'locale.js');
			var newPath = path.join(appname, 'modules', moduleName, 'locale', locale+'.js');
			fs.renameSync(oldPath, newPath);
		});
	}
	
/* ----------------
-------------------
CREATE APP - TO DO
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
			createModule(appname, spec.agents[i]);
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
	
	function recursiveFolderLoop(appname, folderPath, folder){
		fs.mkdir(path.join(path.resolve(appname), folderPath, folder), function(response){
			  	fs.readdirSync(path.join(__dirname, '../', 'template', folderPath, folder)).forEach(function(file) {
	  			  	var checkIfDirectory = isDirectory(path.join(__dirname, '../', 'template', folderPath, folder, file));
			  		if(checkIfDirectory){
			  			var folderPathNew = path.join(folderPath, folder);
			  			recursiveFolderLoop(appname, folderPathNew, file)
			  		}else{
			  			createTemplate(appname, path.join(folderPath, folder, file), null);
			  		}
			  	});
		 });  
	}
	
	function checkIfFolder(appname, folderName, file){
		var checkIfDirectory = isDirectory(path.join(__dirname, '../', 'template', folderName, file));
    	if(checkIfDirectory){
    		recursiveFolderLoop(appname, folderName, file);
    	}else{
    		createTemplate(appname, path.join(folderName, file), null);
    	}
	}
	
	function createProject(spec) {
		var appname = new S(spec.name).camelize().s,
			isNew = !fs.existsSync(appname);
		createScaffold(appname);
		createTemplate(appname, 'README.md');
	    createTemplate(appname, 'index.html');
		copyFiles = function() { //CALLED FROM setupDependencies FUNCTION
		    createTemplate(appname, 'Gruntfile.js');
		    fs.readdirSync(path.join(__dirname, '../', 'template', 'shared')).forEach(function(file) {
	        	checkIfFolder(appname, 'shared', file)
	        });
	        fs.readdirSync(path.join(__dirname, '../', 'template', 'gruntTasks')).forEach(function(file) {
	        	checkIfFolder(appname, 'gruntTasks', file)
	        });
	        fs.readdirSync(path.join(__dirname, '../', 'template', 'styles')).forEach(function(file) {
	        	checkIfFolder(appname, 'styles', file)
	    	});
	        fs.readdirSync(path.join(__dirname, '../', 'template', 'libs')).forEach(function(file) {
	        	checkIfFolder(appname, 'libs', file)
	  	    });
	        fs.readdirSync(path.join(__dirname, '../', 'template', 'partials')).forEach(function(file) {
	        	checkIfFolder(appname, 'partials', file) 
		    });
		}
		createApp(appname, spec);
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
		// The JSON spec must be validated before any project scaffold or code is generated
		var valid = tv4.validate(spec, schemata);
		if (!valid) {
			cursor.red();
			cursor.reset();
			return;
		}
		createProject(spec);
	};

	// Export functions for testing
	json2angular.createState = createState;
	
	module.exports = json2angular;