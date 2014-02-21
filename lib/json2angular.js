process.on('uncaughtException', function(err) {
  console.log(err.stack);
});

var fs = require('fs'), path = require('path'), cp = require('child_process'),
compileDebug = true,
ansi = require('ansi'), cursor = ansi(process.stdout),

S = require('string'),
ejs = require('ejs'),
tv4 = require('tv4'), mustache = require('mustache'), beautify = {
  '.html' : require('js-beautify').html,
  '.js' : function(content) {
    return content;
  },
  '.json' : function(content) {
    return content;
  },
  '.css' : function(content) {
    return content;
  },
  '.sh' : function(content) {
    return content;
  },
  '.md' : function(content) {
    return content;
  }
}, schemata = require('./schemata');

// Define the main object to export
// TODO: Remove nulls, add only javascript object types
var TYPES = {
  "number" : "null",
  "string" : "null",
  "submit" : "null",
  "enum" : "null",
  "date" : "null",
  "checkbox" : "{}"
}
var json2angular = {};

function createTemplate(appname, filename, view, renderer) {
  renderer = renderer ||mustache.render;
  // Handle the Mustache view
  view = !view ? {} : view
  view.appname = appname

  var filepath = path.join(__dirname, '..', 'template', filename);
  var source = fs.readFileSync(filepath, 'utf8');
  var content = renderer(source, view);
  var ext = path.extname(filename);
  fs.writeFileSync(path.join(appname, filename), beautify[ext](content))
};

function createScaffold(appname) {

  // Create the app directory
  fs.mkdirSync(appname);
  var projectPath = path.join(__dirname, appname);

  [ 'constant', 'service', 'partial', 'controller' ].forEach(
      function(directory) {
        var appDirectory = path.join(appname, directory)
        fs.mkdirSync(appDirectory);
      }, this);
};

// Each actionaable is composed of one or many elements. Each element maps to an
// HTML tag
// such as input, select, etc. This method handles the many possible
// configurations for
// these elements.
function createActionableElement(stateName, elementName, type, ui, rest) {
  var fragmentDir, fragmentPath, fileExists, source, view, options;

  ui = ui || {};
  type = type || 'default';

  fragmentDir = path.join(__dirname, '..', 'template', 'fragment');
  fragmentPath = path.join(fragmentDir, type + '.html');

  fileExists = fs.existsSync(fragmentPath);
  
  if (!fileExists) {
    cursor.red();
    console.log("Fragment type", type, "is not yet supported.");
    cursor.reset();
    return;
  }
  source = fs.readFileSync(fragmentPath, 'utf8');

  // Spoof an empty array if no options are provided
  options = ui.options || [];
  options = options.map(function(d) {
    return '"' + d + '"';
  }).join(", ");

  view = {
    'class' : ui['class'] || '',
    'state' : stateName.s,
    elementName:elementName,
    'model' : stateName.s + '.' + elementName,
    'name' : stateName.humanize().s,
    'title' : ui['title'],
    'options' : options
  };

  return mustache.render(source, view);
};

// Inside each state are one or more actionables that collect user input and
// transition to another state. These actionable are composed of HTML fragments
// with data-bindings to an AngularJS controller.
function createActionable(stateName, description, rest) {

  // The description must have a `ui` and `elements` key. The `ui` key describes
  // a parent
  // node, which should be generated last. The `elements` key should described
  // at least one
  // explicit UI element (e.g. input, button, component).
  stateName = new S(stateName);
  var elements = description.components.elements;

  var fragments = [];
  for ( var name in elements) {
    var definition = elements[name];
    fragments.push({
      label : name,
      fragment : createActionableElement(stateName, name, definition.type,
          definition.ui, rest)
    });
  }
  var actions = description.components.actions;
  for ( var name in actions) {
    var definition = actions[name];
    fragments.push({
      label : name,
      fragment : createActionableElement(stateName, name, definition.type,
          definition.ui, rest)
    });
  }
  return fragments
}

// An application is described by many states. Each state defines UI elements
// and provides actionables to expose other application states. This function
// drives the UI generation for a specifed state.
function createState(appname, statename, description, layout, rest) {

  // Extract scope variables for Angular controller
  // TODO: Make more readable!
  var scopeVariables = [];
  for ( var key in description.elements) {
    var elements = description.elements[key].components.elements;

    var keys = Object.keys(elements);
    var variables = [];

    for ( var variable in elements) {
      variables.push({
        variable : variable,
        type : TYPES[elements[variable].type] || "null"
      });
    }
    scopeVariables.push({
      stateName : key,
      variables : variables
    });
  }

  statename = new S(statename);

  // Every state description must have an `element` key.

  // Generate the most deeply nested child node first, and work
  // up the heirarchy until reaching the top-level parent tag.
  var elements = description.elements;

  for ( var name in elements) {
    var name = new S(name);

    var fragments = createActionable(name.s, elements[name.s], rest);
    createTemplate(appname, path.join('partial', 'actionable.html'), {
      stateName:name,
      elements : fragments,
      actionables:description,
      compileDebug:compileDebug,
      console:console
    },ejs.render);
    
    // Rename the actionable template to the actionable name
    var oldPath = path.join(appname, 'partial', 'actionable.html');
    var newPath = path.join(appname, 'partial', statename.camelize().s.replace(path.sep, "_") + '.'
        + name.camelize().s + '.html');

    fs.renameSync(oldPath, newPath);
  }

  // Setup view for state partial
  var view = {
    name : statename.humanize().s
  };
  
  createTemplate(appname, path.join('partial', 'state.html'), view);

  view = {
    name : statename.camelize().s.replace(path.sep, "_"),
    scopeVariables : scopeVariables,
    endpoint : statename.s.toLowerCase(),
    actionables:description,
    compileDebug:compileDebug
  };
  createTemplate(appname, path.join('controller', 'controller.js'), view,ejs.render);
  // Rename the partial using the state name
  var partialPath = path.join(appname, 'partial');
  var oldPath = path.join(partialPath, 'state.html');
  var newPath = path.join(partialPath, statename.camelize().s.replace(path.sep, "_") + '.html');
  
  fs.renameSync(oldPath, newPath);

  // Create state controller
  var controllerPath = path.join(appname, 'controller');
  oldPath = path.join(controllerPath, 'controller.js');
  newPath = path.join(controllerPath, statename.camelize().s.replace(path.sep, "_") + '.js');
  
  fs.renameSync(oldPath, newPath);
}

// Parse an application spec, and drive UI generation
function createApp(appname, states, layout, rest) {
  for ( var name in states) {
    var description = states[name];
    createState(appname, name, description, layout, rest);
  }
  // Create app.js including all the states and transition states for ui-router
  var view = Object.keys(states).map(
      function(state, index) {
        var state = new S(state);
        var obj = {
          name : state.s,
          url : states[state].url,
          controller : state.camelize().s.replace(path.sep,"_"),
          actionables : Object.keys(states[state.s].elements).map(
              function(actionable) {
                var meta = states[state.s].elements[actionable]
                return {
                  subPath:meta.subPath,
                  actionableName : actionable,
                  actionable:meta
                };
              })
        };

        return obj;
      });
  createTemplate(appname, 'app.js', {
    states : view,
    console:console,
    compileDebug:compileDebug
  },ejs.render);

}

// This is the top level function for application generation. It drives other
// functions
// to create a scaffold and templates.
function createProject(spec) {
  var appname, states, layout, rest;

  appname = new S(spec.name);
  appname = appname.camelize().s;

  states = spec.states;
  layout = spec.layout;
  rest = spec.REST;

  // First check if the app name exists in the filesystem
  if (!fs.existsSync(appname)) {
    createScaffold(appname);
    createTemplate(appname, 'setup.sh');
    fs.chmodSync(path.resolve(path.join(appname, 'setup.sh')), '0755');
    cp.exec(path.resolve(path.join(appname, 'setup.sh')), {
      cwd : path.resolve(appname),
      env : process.env
    }, function(err, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);
    })
    createTemplate(appname, 'README.md');
    createTemplate(appname, 'style.css');
    createTemplate(appname, 'bower.json');
  }

  createTemplate(appname, path.join('constant', 'serverLocation.js'));
  createTemplate(appname, path.join('service', 'SocketService.js'));
  createTemplate(appname, path.join('service', 'RestService.js'));

  var controllers = [];
  Object.keys(states).forEach(function(name){
    controllers.push(name.replace(path.sep,'_'));
  })
  createTemplate(appname, 'index.html', {
    controllers : controllers
  });

  createApp(appname, states, layout, rest);
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
json2angular.createActionableElement = createActionableElement;
json2angular.createActionable = createActionable;
json2angular.createState = createState;

module.exports = json2angular;
