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
    
    // Create app.js, view and controller directories
    var view = Object.keys(states).map(function(state, index) {
      return {
        name: state,
        url: new S(state).dasherize().s,
        controller: new S(state).humanize().capitalize().camelize().s
      };
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
  function createActionableElement(stateName, elementName, type, ui) {
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
        ui["class"] = "btn btn-default";
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
        ui["class"] = "btn btn-default";
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
        ui["class"] = "btn btn-default";
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
        ui["class"] = ui["class"] + " form-control";
        
        break;
      case "date":
        
        ui = {};
        ui["tag"] = "i";
        ui["class"] = "glyphicon glyphicon-calendar";
        var html = json2html.transform(data, ui);
        
        ui = {};
        ui["tag"] = "button";
        ui["class"] = "btn btn-default";
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
        ui["class"] = "form-control";
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
        ui["class"] = "btn btn-default";
        ui["html"] = "Submit";
        ui["ui-sref"] = "${state}";
        delete ui["ng-model"];
        
        break;
      }
    }
    
    return json2html.transform(data, ui);
  };
  
  // Inside each state are one or more actionables that collect user input and
  // transition to another state. These actionable are composed of HTML fragments
  // with data-bindings to an AngularJS controller.
  function createActionable(stateName, description) {
    
    // The description must have a `ui` and `elements` key. The `ui` key describes a parent
    // node, which should be generated last. The `elements` key should described at least one
    // explicit UI element (e.g. input, button, component).
    stateName = new S(stateName);
    var elements = description.elements;
    
    var fragments = [];
    var data = {stateName: stateName.humanize().s};
    var ui = {tag: "h3", html: "${stateName}"};
    
    var fragment = json2html.transform({stateName: stateName.humanize().s}, {tag: "h3", html: "${stateName}"});
    fragments.push(fragment);
    
    for (var name in elements) {
      // Each element should have a `ui` property that is mapped directly to an
      // HTML fragment (using json2html). `ui` must have a `tag` property.
      
      var definition = elements[name];
      fragment = createActionableElement(stateName, name, definition.type, definition.ui);
      fragments.push(fragment);
    }
    
    // Append fragments to parent node
    data = { html: fragments.join('') };
    ui = description.ui;
    ui.class = "actionable well col-md-6";
    ui.html = "${html}";
    
    return json2html.transform(data, ui);
  }
  
  // An application is described by many states. Each state defines UI elements
  // and provides actionables to expose other application states. This function
  // drives the UI generation for a specifed state.
  function createState(appname, statename, description) {
    
    // Extract scope variables for Angular controller
    // TODO: Make more readable!
    var scopeVariables = [];
    for (var key in description.elements) {
      var elements = description.elements[key].elements;
      
      var keys = Object.keys(elements);
      var variables = [];
      
      for (var variable in elements) {
        variables.push({variable: variable, type: TYPES[elements[variable].type] || "null"});
      }
      scopeVariables.push({stateName: key, variables: variables});
    }
    
    statename = new S(statename);
    
    // Every state description must have an `element` key.
    
    // Generate the most deeply nested child node first, and work
    // up the heirarchy until reaching the top-level parent tag.
    var elements = description.elements;
    var actionables = [];
    
    for (var name in elements) {
      var actionable = createActionable(name, elements[name]);
      actionables.push(actionable);
    }
    
    var view = { name: statename.humanize().s, html: actionables.join('') };
    createTemplate(appname, path.join('partial', 'state.html'), view);
    
    view = { name: statename.humanize().capitalize().camelize().s, scopeVariables: scopeVariables };
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
  function createApp(appname, states) {
    
    for (var name in states) {
      var description = states[name];
      createState(appname, name, description);
    }
    
  }
  
  // This is the top level function for application generation. It drives other functions
  // to create a scaffold and templates.
  function createProject(spec) {
    var appname, states;
    
    appname = new S(spec.name);
    appname = appname.camelize().s;
    
    states = spec.states;
    
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
    createTemplate(appname, path.join('constant', 'socketServer.js'));
    createTemplate(appname, path.join('service', 'SocketService.js'));
    
    createApp(appname, states);
  };
  
  // This function is the main driver that is executed by the `json2angular` binary.
  json2angular.exec = function(schemaFile) {
    
    fs.readFile(schemaFile, 'utf8', function(err, data) {
      var spec = JSON.parse(data);
      
      // The JSON spec must be validated before any project scaffold or code is generated
      var valid = tv4.validate(spec, schemata.app);
      if (!valid) {
        cursor.red();
        console.log(tv4.error);
        cursor.reset();
        return;
      }
      
      createProject(spec);
    });
  };
  
  // Export functions for testing
  json2angular.createActionableElement = createActionableElement;
  json2angular.createActionable = createActionable;
  json2angular.createState = createState;
  
  module.exports = json2angular;
  
}());