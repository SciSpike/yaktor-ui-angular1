process.on('uncaughtException', function(err) {
  console.log(err.stack);
});

var fs = require('fs'), path = require('path'), cp = require('child_process'),
compileDebug = true,
ansi = require('ansi'), cursor = ansi(process.stdout),

S = require('string'),
ejs = require('ejs'),
_ = require('underscore'),
tv4 = require('tv4'), mustache = require('mustache'), beautify = {
  '.html' : require('js-beautify').html,
  '.ejs' : require('js-beautify').html
}, schemata = require('./schemata');
var dummyRenderer = function(s,d){
  return s;
}
var json2angular = {};
var templates ={
    
};
function renderTemplate (filename,data,renderer){
  renderer = renderer ||mustache.render;
  var source = templates[filename];
  var filepath = path.join(__dirname, '..', 'template', filename);
  if(!source){
    source = templates[filename] = fs.readFileSync(filepath, 'utf8');
  }
  data.filename=filepath;
  return renderer(source, data);
}

function createTemplate(appname, filename, view, renderer) {
  // Handle the Mustache view
  view = !view ? {} : view
  view.appname = appname

  var content = renderTemplate(filename,view, renderer);
  var ext = path.extname(filename);
  fs.writeFileSync(path.join(appname, filename), beautify[ext]?beautify[ext](content):content)
};

function createScaffold(appname) {

  // Create the app directory
  !fs.existsSync(appname) && fs.mkdirSync(appname);
  var projectPath = path.join(__dirname, appname);

  [ 'libs','constant', 'service', 'partial', 'controller','controller/custom', 'gruntTasks','locale',"modules","styles", "less"].forEach(
      function(directory) {
        var appDirectory = path.join(appname, directory)
        !fs.existsSync(appDirectory) && fs.mkdirSync(appDirectory);
      }, this);
  
  var customGruntFile = path.join(appname, 'Gruntfile_custom.js')
  !fs.existsSync(customGruntFile) && createTemplate(appname, 'Gruntfile_custom.js');
  
  var packageJson = path.join(appname, 'package.json')
  !fs.existsSync(packageJson) && createTemplate(appname, 'package.json');
};

function createContents(elements ,path){
  var contents = "";
  var count = 0;
  Object.keys(elements).sort().forEach(function(e){
    var myPath = path?path +"."+e : e;
    var element =  elements[e];
    if(element.type!= null && !element.components ){
      if(element.typeWrapper == 'array'){
        var pathPart = myPath+"[$index]";
        var typeWrapper = element.typeWrapper;
        contents += renderTemplate("fragment/"+typeWrapper+"-wrapper.html",{
          element:element,
          path: myPath,
          pathPart:pathPart,
          contents:
            renderTemplate("fragment/"+element.type+".html",{
              element:element,
              path: pathPart
            },_.template)
        },_.template);
      } else {
        contents += 
          renderTemplate("fragment/element.html",{
            element:element,
            path: myPath,
            contents:
              renderTemplate("fragment/"+element.type+".html",{
                element:element,
                path: myPath
              },_.template)
          },_.template)
      }
    } else if (element.components) {
      if(element.type == 'array'){
        var pathPart = myPath.replace(/\./g,'_');
        contents += renderTemplate("fragment/arrayOfElements.html",{
          element:element,
          path: myPath,
          pathPart:pathPart,
          contents:createContents(element.components.elements,pathPart)
        },_.template)
      } else {
        contents += renderTemplate("fragment/elements.html",{
          element:element,
          contents:createContents(element.components.elements,myPath)
        },_.template)
      }
    }
    
  }); 
  return contents;
}

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

// An application is described by many states. Each state defines UI elements
// and provides actionables to expose other application states. This function
// drives the UI generation for a specifed state.
function createState(appname, stateName, description,states) {
  
  stateName = new S(stateName);

  var newPath = path.join(appname, 'controller',"custom", description.friendly + '.js');
  if(!fs.existsSync(newPath)){
    createTemplate(appname, path.join('controller', 'emptyController.js'), {
      actionableName:"",
      actionables:description
    },ejs.render);
    // Rename the actionable template to the actionable name
    var oldPath = path.join(appname, 'controller', 'emptyController.js');
    fs.renameSync(oldPath, newPath);
  }
  
  
  var elements = description.elements;
  for ( var n in elements) {
    var element = elements[n];
    
    createTemplate(appname, path.join('partial', 'actionable.html'), {
      actionableName:n,
      contents : element.components?createContents(element.components.elements,"data."+n):"",
      actionable:element,
      actionables:description
      
    },ejs.render);
    
    // Rename the actionable template to the actionable name
    var oldPath = path.join(appname, 'partial', 'actionable.html');
    var newPath = path.join(appname, 'partial', description.friendly + '.'+ n + '.html');
    fs.renameSync(oldPath, newPath);
    
    var newPath = path.join(appname, 'controller',"custom", description.friendly + '.'+ n + '.js');
    if(!fs.existsSync(newPath)){
      createTemplate(appname, path.join('controller', 'emptyController.js'), {
        actionableName:n,
        actionables:description
      },ejs.render);
      
      // Rename the actionable template to the actionable name
      var oldPath = path.join(appname, 'controller', 'emptyController.js');
      fs.renameSync(oldPath, newPath);
    }
  }
  
  // Setup view for state partial
  createTemplate(appname, path.join('partial', 'state.html'), {
      stateName:stateName.s,
      description:description
    },ejs.render);
  // Rename the partial using the state name
  var partialPath = path.join(appname, 'partial');
  var oldPath = path.join(partialPath, 'state.html');
  var newPath = path.join(partialPath, description.friendly + '.html');
  fs.renameSync(oldPath, newPath);

  view = {
    statename : stateName.s.toLowerCase(),
    description:description,
    states:states
  };
  createTemplate(appname, path.join('controller', 'controller.js'), view,ejs.render);
  // rename the controller
  var controllerPath = path.join(appname, 'controller');
  oldPath = path.join(controllerPath, 'controller.js');
  newPath = path.join(controllerPath, description.friendly + '.js');
  
  fs.renameSync(oldPath, newPath);
}

// Parse an application spec, and drive UI generation
function createApp(appname, spec) {
  var states = spec.states;
  var flattenedTitles = [];
  for ( var name in states) {
    var description = states[name];
    flattenTitles(flattenedTitles,description,name.toUpperCase())
  }
  for ( var name in states) {
    var description = states[name];
    createState(appname, name, description,states);
  }
  var locale = process.env.LANG?process.env.LANG.replace(/\..*/,""):"en_US";
  createTemplate(appname, path.join('locale', 'locale.js'), {
    title:spec.title,
    keys:flattenedTitles.sort(function(e1,e2){
      return e1.key.localeCompare(e2.key);
    }),
    locale:locale
  });
  var oldPath = path.join(appname, 'locale', 'locale.js');
  var newPath = path.join(appname, 'locale', locale+'.js');
  fs.renameSync(oldPath, newPath);
  
  createTemplate(appname, 'app.js', {
    states : states
  },ejs.render);
  
}

// This is the top level function for application generation. It drives other
// functions
// to create a scaffold and templates.
function createProject(spec) {
  var appname = new S(spec.name).camelize().s
    , isNew = !fs.existsSync(appname);


  createScaffold(appname);

  // First check if the app name exists in the filesystem
  if (isNew) {
    createTemplate(appname, 'README.md');
  }
  
  fs.readdirSync(path.join(__dirname, '../', 'template', 'less')).forEach(function(file) {
    createTemplate(appname, path.join('less', file),null,dummyRenderer);
  });
  
  createTemplate(appname, 'bower.json');
  createTemplate(appname, 'setup.sh');
  
  var doStuff = function() {

    createTemplate(appname, path.join('constant', 'serverLocation.js'));
    createTemplate(appname, path.join('service', 'SocketService.js'));
    createTemplate(appname, path.join('service', 'RestService.js'));
    createTemplate(appname, 'Gruntfile.js');
    
    fs.readdirSync(path.join(__dirname, '../', 'template', 'gruntTasks')).forEach(function(file) {
      createTemplate(appname, path.join('gruntTasks', file),null,dummyRenderer);
    });
    fs.readdirSync(path.join(__dirname, '../', 'template', 'libs')).forEach(function(file) {
      createTemplate(appname, path.join('libs', file),null,dummyRenderer);
    });
    /*fs.readdirSync(path.join(__dirname, '../', 'template', 'fonts')).forEach(function(file) {
      !fs.existsSync( path.join(appname,'fonts', file)) &&
      createTemplate(appname, path.join('fonts', file),null,dummyRenderer);
    });*/
    fs.readdirSync(path.join(__dirname, '../', 'template', 'modules')).forEach(function(folder) {
  	  fs.mkdir(path.join(path.resolve(appname), 'modules', folder), function(response){
  	    
		  	fs.readdirSync(path.join(__dirname, '../', 'template', 'modules', folder)).forEach(function(file) {
		  	  /* BIG ASSUMPTION HERE */
		  	  if(file == 'custom'){
	          !fs.existsSync( path.join(appname,'modules', folder, file)) &&
	          fs.mkdirSync(path.join(path.resolve(appname), 'modules', folder, file));
	          fs.readdirSync(path.join(__dirname, '../', 'template', 'modules', folder, file)).forEach(function(customFile) {
	            !fs.existsSync( path.join(appname,'modules', folder, file, customFile)) &&
	            createTemplate(appname, path.join('modules', folder, file, customFile), {}, ejs.render);
	          });
	        }else{
	          createTemplate(appname, path.join('modules', folder, file), {}, ejs.render);
	        }
		  	});
	     });   
    });
    
    
    
    
    
    
    
    
    
    

    createTemplate(appname, 'index.ejs', {
      states:spec.states
    },ejs.render);
    
    createTemplate(appname, 'controller/headerController.js', {
      states:spec.states
    },ejs.render)

    createApp(appname, spec);
    
    cp.spawn('npm',['install'], {
         cwd : path.resolve(appname),
         env : process.env,
         stdio: [0,1,2]
       }).on('close',
        function (error) {
         if (error) {
           console.log('exec error: ' + error);
         }
         cp.spawn('npm',['test'], {
             cwd : path.resolve(appname),
             env : process.env,
             stdio: [0,1,2]
           }).on('close',
            function (error) {
                if (error) {
                     console.log('exec error: ' + error);
                }
            });
        });
  }
  
  fs.chmodSync(path.resolve(path.join(appname, 'setup.sh')), '0755');
  cp.spawn(path.resolve(path.join(appname, 'setup.sh')), [],{
    cwd : path.resolve(appname),
    env : process.env,
    stdio: [0,1,2]
  }).on('close', function(error) {
    if (error) {
      console.log('exec error: ' + error);
    }
    doStuff();
  });
  

};

//This function is the main driver that is executed by the `json2angular`
//binary.
json2angular.exec = function(spec) {

 // The JSON spec must be validated before any project scaffold or code is
 // generated
 var valid = tv4.validate(spec, schemata);
 if (!valid) {
   cursor.red();
   console.log(tv4.error);
   console.log(JSON.stringify(spec,null,2))
   cursor.reset();
   return;
 }
};

// This function is the main driver that is executed by the `json2angular`
// binary.
json2angular.exec = function(spec) {

  // The JSON spec must be validated before any project scaffold or code is
  // generated
  var valid = tv4.validate(spec, schemata);
  if (!valid) {
    cursor.red();
    console.log(tv4.error);
    console.log(JSON.stringify(spec,null,2))
    cursor.reset();
    return;
  }

  createProject(spec);
};

// Export functions for testing
json2angular.createState = createState;

module.exports = json2angular;
