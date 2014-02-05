(function() {
      
  var fs = require('fs'),
      path = require('path'),
      
      ansi = require('ansi'),
      cursor = ansi(process.stdout),
      
      S = require('string'),
      
      tv4 = require('tv4'),
      json2html = require('node-json2html'),
      mustache = require('mustache'),
      beautify = {
        '.html': require('js-beautify').html,
        '.js': function(content) { return content; },
        '.json': function(content) { return content; },
        '.css': function(content) { return content; },
        '.sh': function(content) { return content; },
        '.md': function(content) { return content; }
      },
      schemata = require('./schemata');
      
  // Define the main object to export
  // TODO: Remove nulls, add only javascript object types
  var TYPES = {
    "number": "null",
    "string": "null",
    "submit": "null",
    "enum": "null",
    "date": "null",
    "checkbox": "{}"
  }
  var json2angular = {};
  
  function createTemplate(appname, filename, view) {
    
    // Handle the Mustache view
    view = !view ? {} : view
    view.appname = appname
    
    var filepath = path.join(__dirname, '..', 'template', filename);
    var source = fs.readFileSync(filepath, 'utf8');
    var f = fs.openSync(path.join(appname, filename), 'w');
    var content = mustache.render(source, view);
    var ext = path.extname(filename);
    
    fs.writeSync(f, beautify[ext](content))
    fs.closeSync(f);
  };
  
  function createScaffold(appname, states) {
    
    // Create the app directory
    fs.mkdirSync(appname);
    var projectPath = path.join(__dirname, appname);
    
    // Create app.js including all the states and transition states for ui-router
    var view = Object.keys(states).map(function(state, index) {
      var state = new S(state);
      
      var obj = {
        name: state.s,
        url: state.dasherize().s,
        controller: state.humanize().capitalize().camelize().s,
        actionables: Object.keys(states[state.s].elements).map(function(actionable) {
          return {
            actionableName: actionable,
          };
        })
      };
      
      return obj;
    });
    createTemplate(appname, 'app.js', {states: view});
    
    ['constant', 'service', 'partial', 'controller'].forEach(function(directory) {
      var appDirectory = path.join(appname, directory)
      fs.mkdirSync(appDirectory);
    }, this);
  };
  
  // Each actionaable is composed of one or many elements. Each element maps to an HTML tag
  // such as input, select, etc. This method handles the many possible configurations for
  // these elements.
  function createActionableElement(stateName, elementName, type, ui, rest) {
    console.log("createActionableElement", stateName, elementName, type, ui, rest);
    ui = ui || {};
    
    // Data bind on the fragment
    ui["ng-model"] = 'data.${state}.${model}';
    
    var data = {
      state: stateName.s,
      model: elementName,
      stateNameHumanized: stateName.humanize().s
    };
    
    // Create fragment based on type
    if (type) {
      switch (type) {
        
      case "toggle":
        ui["tag"] = ui["type"] = "button";
        ui["class"] = ui["class"] || "";
        ui["class"] = "btn btn-default btn-sm";
        ui["btn-checkbox"] = null;
        ui["btn-checkbox-true"] = "0";
        ui["btn-checkbox-false"] = "1";
        ui["html"] = "${stateNameHumanized}";
        
        break;
      case "checkbox":
        
        var options = ui.options || [];
        options = options.map(function(d) { return '"' + d + '"'; }).join(", ");
        ui["ng-repeat"] = "option in [" + options + "] track by $index";
        delete ui.options;
        
        ui["tag"] = ui["type"] = "button";
        ui["btn-checkbox"] = null;
        ui["class"] = ui["class"] || "";
        ui["class"] = "btn btn-default btn-sm";
        ui["html"] = "{{option}}";
        ui["ng-model"] += "[option]";
        
        ui = {
          tag: "div",
          "class": "btn-group",
          html: json2html.transform(data, ui)
        };
        
        break;
      case "radio":
        
        var options = ui.options || [];
        options = options.map(function(d) { return '"' + d + '"'; }).join(", ");
        ui["ng-repeat"] = "option in [" + options + "] track by $index";
        delete ui.options;
        
        ui["tag"] = ui["type"] = "button";
        ui["btn-radio"] = "option";
        ui["class"] = ui["class"] || "";
        ui["class"] = "btn btn-default btn-sm";
        ui["html"] = "{{option}}";
        
        ui = {
          tag: "div",
          "class": "btn-group",
          html: json2html.transform(data, ui)
        };
        
        break;
      case "enum":
        
        // Spoof an empty array if no options are provided
        var options = ui.options || [];
        options = options.map(function(d) { return '"' + d + '"'; }).join(", ");
        ui["ng-options"] = "option for option in [" + options + "]";
        delete ui.options;
        
        ui["tag"] = "select";
        ui["class"] = ui["class"] || "";
        ui["class"] = ui["class"] + " form-control input-sm";
        
        break;
      case "date":
        
        ui = {};
        ui["tag"] = "i";
        ui["class"] = "glyphicon glyphicon-calendar";
        var html = json2html.transform(data, ui);
        
        ui = {};
        ui["tag"] = "button";
        ui["class"] = "btn btn-default btn-sm";
        ui["html"] = html;
        html = json2html.transform(data, ui);
        
        ui = {};
        ui["tag"] = "span";
        ui["class"] = "input-group-btn";
        ui["html"] = html;
        html = json2html.transform(data, ui);
        
        ui = {};
        ui["tag"] = "input";
        ui["type"] = "text";
        ui["class"] = "form-control input-sm";
        ui["datepicker-popup"] = "dd-MMMM-yyyy";
        ui["show-weeks"] = "false";
        ui["show-button-bar"] = "false";
        ui["ng-model"] = 'data.${state}.${model}';
        html = json2html.transform(data, ui) + html;
        
        ui = {};
        ui["tag"] = "p";
        ui["class"] = "input-group";
        ui["html"] = html;
        
        break;
      case "submit":
        ui["tag"] = ui["type"] = "button";
        ui["class"] = ui["class"] || "";
        ui["class"] = "btn btn-default btn-sm";
        ui["html"] = "Submit";
        
        
        if (rest) {
          ui["ng-click"] = 'onSubmit("${state}")';
        } else {
          ui["ui-sref"] = "${state}";
        }
        delete ui["ng-model"];
        
        break;
      }
    }
    
    return json2html.transform(data, ui);
  };
  
  // Inside each state are one or more actionables that collect user input and
  // transition to another state. These actionable are composed of HTML fragments
  // with data-bindings to an AngularJS controller.
  function createActionable(stateName, description, rest) {
    
    // The description must have a `ui` and `elements` key. The `ui` key describes a parent
    // node, which should be generated last. The `elements` key should described at least one
    // explicit UI element (e.g. input, button, component).
    stateName = new S(stateName);
    var elements = description.elements;
    
    var fragments = [];
    for (var name in elements) {
      var definition = elements[name];
      fragments.push({
        label: name,
        fragment: createActionableElement(stateName, name, definition.type, definition.ui, rest)
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
    for (var key in description.elements) {
      var elements = description.elements[key].elements;
      
      var keys = Object.keys(elements);
      var variables = [];
      
      for (var variable in elements) {
        if (variable === "defaultAction") { continue; }
        variables.push({variable: variable, type: TYPES[elements[variable].type] || "null"});
      }
      scopeVariables.push({stateName: key, variables: variables});
    }
    
    statename = new S(statename);
    
    // Every state description must have an `element` key.
    
    // Generate the most deeply nested child node first, and work
    // up the heirarchy until reaching the top-level parent tag.
    var elements = description.elements;
    
    for (var name in elements) {
      var name = new S(name);
      
      var fragments = createActionable(name.s, elements[name.s], rest);
      createTemplate(appname, path.join('partial', 'actionable.html'), {elements: fragments});
      
      // Rename the actionable template to the actionable name
      var oldPath = path.join(appname, 'partial', 'actionable.html');
      var newPath = path.join(appname, 'partial', statename.dasherize().s + '.' + name.s + '.html');
      fs.renameSync(oldPath, newPath);
    }
    
    // Setup view for state partial
    var view = { name: statename.humanize().s };
    createTemplate(appname, path.join('partial', 'state.html'), view);
    
    view = {
      name: statename.humanize().capitalize().camelize().s,
      scopeVariables: scopeVariables,
      endpoint: statename.s.toLowerCase()
    };
    createTemplate(appname, path.join('controller', 'controller.js'), view);
    
    // Rename the partial using the state name
    var partialPath = path.join(appname, 'partial');
    var oldPath = path.join(partialPath, 'state.html');
    var newPath = path.join(partialPath, statename.dasherize().s + '.html');
    fs.renameSync(oldPath, newPath);
    
    // Create state controller
    var controllerPath = path.join(appname, 'controller');
    oldPath = path.join(controllerPath, 'controller.js');
    newPath = path.join(controllerPath, statename.camelize().s + '.js');
    fs.renameSync(oldPath, newPath);
  }
  
  // Parse an application spec, and drive UI generation
  function createApp(appname, states, layout, rest) {
    
    for (var name in states) {
      var description = states[name];
      createState(appname, name, description, layout, rest);
    }
    
  }
  
  // This is the top level function for application generation. It drives other functions
  // to create a scaffold and templates.
  function createProject(spec) {
    var appname, states, layout, rest;
    
    appname = new S(spec.name);
    appname = appname.camelize().s;
    
    states = spec.states;
    layout = spec.layout;
    rest = spec.REST;
    
    // First check if the app name exists in the filesystem
    if (fs.existsSync(appname)) {
      cursor.red();
      console.log("The application name " + appname + " already exists.");
      cursor.reset();
      return;
    }
    
    createScaffold(appname, states);
    createTemplate(appname, 'setup.sh');
    fs.chmodSync(path.join(appname, 'setup.sh'), '0755');
    createTemplate(appname, 'README.md');
    createTemplate(appname, 'index.html', {controllers: Object.keys(states)});
    createTemplate(appname, 'style.css');
    createTemplate(appname, 'bower.json');
    createTemplate(appname, path.join('constant', 'serverLocation.js'));
    createTemplate(appname, path.join('service', 'SocketService.js'));
    createTemplate(appname, path.join('service', 'RestService.js'));
    
    createApp(appname, states, layout, rest);
  };
  
  // This function is the main driver that is executed by the `json2angular` binary.
  json2angular.exec = function(spec) {
    
    // The JSON spec must be validated before any project scaffold or code is generated
    var valid = tv4.validate(spec, schemata);
    if (!valid) {
      cursor.red();
      console.log(tv4.error);
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
}());