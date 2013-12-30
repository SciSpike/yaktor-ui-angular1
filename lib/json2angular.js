(function() {
      
  var fs = require('fs'),
      path = require('path'),
      
      ansi = require('ansi'),
      cursor = ansi(process.stdout),
      
      S = require('string'),
      
      tv4 = require('tv4'),
      validator = require('jsonschema').Validator,
      json2html = require('node-json2html'),
      mustache = require('mustache'),
      beautify = {
        '.html': require('js-beautify').html,
        '.js': function(content) { return content; },
        '.json': function(content) { return content; },
        '.css': function(content) { return content; },
      },
      
      schemata = require('./schemata');
      
  // Define the main object to export
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
        url: new S(state).dasherize().s
      };
    });
    createTemplate(appname, 'app.js', {states: view});
    
    ['controller', 'service', 'partial'].forEach(function(directory) {
      var appDirectory = path.join(appname, directory)
      fs.mkdirSync(appDirectory);
    }, this);
  };
  
  // Inside each state are one or more actionables that collect user input and
  // transition to another state. These actionable are composed of HTML fragments
  // with data-bindings to an AngularJS controller.
  function createActionable(name, description) {
    // The description must have a `ui` and `elements` key. The `ui` key describes a parent
    // node, which should be generated last. The `elements` key should described at least one
    // explicit UI element (e.g. input, button, component).
    var elements = description.elements;
    
    var fragments = [];
    for (var el in elements) {
      
      // Each element should have a `ui` property that is mapped directly to an
      // HTML fragment (using json2html). `ui` must have a `tag` property.
      
      fragmentDefinition = elements[el];
      var data = {state: name, model: el, name: new S(name).humanize()};
      var ui = fragmentDefinition.ui;
      
      if (ui.tag === "button") {
        ui["ui-sref"] = "${state}"
        ui.html = "${name}";
      } else {
        ui["ng-model"] = 'data.${model}'
      }
      
      var fragment = json2html.transform(data, ui);
      fragments.push(fragment);
    }
    
    // Append fragments to parent node
    var data = { html: fragments.join('') };
    var ui = description.ui;
    ui.class = "actionable well col-md-6";
    ui.html = "${html}";
    
    return json2html.transform(data, ui);
  }
  
  // An application is described by many states. Each state defines UI elements
  // and provides actionables to expose other application states. This function
  // drives the UI generation for a specifed state.
  function createState(appname, statename, description) {
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
    
    // Rename the partial using the state name
    var partialPath = path.join(appname, 'partial');
    var oldPath = path.join(partialPath, 'state.html');
    var newPath = path.join(partialPath, statename.dasherize().s + '.html');
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
    createTemplate(appname, 'index.html');
    createTemplate(appname, 'style.css');
    createTemplate(appname, 'bower.json');
    createTemplate(appname, path.join('service', 'SocketService.js'));
    
    createApp(appname, states);
  };
  
  // This function is the main driver that is executed by the `json2angular` binary.
  json2angular.exec = function(schemaFile) {
    
    fs.readFile(schemaFile, 'utf8', function(err, data) {
      var spec = JSON.parse(data);
      
      // The JSON spec must be validated before any project scaffold or code is generated
      
      var v = new validator();
      // tv4.addSchema('/state', schemata.state);
      // tv4.addSchema('/ui', schemata.ui);
      // tv4.addSchema('/elements', schemata.elements);
      
      isValid = v.validate(spec, schemata.app);
      
      createProject(spec);
    });
  };
  
  module.exports = json2angular;
}());