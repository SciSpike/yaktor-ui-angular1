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
		  'modules/shared',
		  'modules/shared/controllers',
		  'modules/shared/services',
		  'modules/shared/locale',
		  'controllers',
		  'directives',
		  'locale',
		  'gruntTasks',
		  'libs',
		  'libs/vendor',
		  'styles',
		  'styles/less',
		  'styles/css',
		  'partials',
		  'partials/crud',
		  'partials/shared',
		  'constants',
		  'services']
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
	function createState(appname, stateName, description,states) {
		//create module/controllers/controller.js file
		//create partials/module/template.html file
	}
	
/* ----------------
-------------------
CREATE MODULE - TO DO
-------------------
---------------- */
	function createModule(moduleSpec) {
		//create module file
		//create module config
		//create module/controllers folder
		//create module/services folder
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
		Object.keys(spec.states).forEach(function(key) {
			moduleNames.push(key);
		});
		console.log(moduleNames);
		createTemplate(appname, 'app.js', {moduleNames: moduleNames});
		for(var i=moduleNames.length-1; i>=0; i--){
			/*Object.keys(moduleNames[i]).forEach(function(key) {
				moduleNames.push(key);
			});*/
		}
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
			createTemplate(appname, path.join('constants', 'serverLocation.js'));
		    createTemplate(appname, path.join('services', 'SocketService.js'));
		    createTemplate(appname, path.join('services', 'RestService.js'));
		    createTemplate(appname, 'Gruntfile.js');
		    fs.readdirSync(path.join(__dirname, '../', 'template', 'controllers')).forEach(function(file) {
	        	checkIfFolder(appname, 'controllers', file)
	        });
		    fs.readdirSync(path.join(__dirname, '../', 'template', 'locale')).forEach(function(file) {
	        	checkIfFolder(appname, 'locale', file)
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
	        fs.readdirSync(path.join(__dirname, '../', 'template', 'directives')).forEach(function(file) {
	        	checkIfFolder(appname, 'directives', file)
	  	    });
	        fs.readdirSync(path.join(__dirname, '../', 'template', 'partials')).forEach(function(file) {
	        	checkIfFolder(appname, 'partials', file) 
		    });
		}
		createApp(appname, spec); //TO DO
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