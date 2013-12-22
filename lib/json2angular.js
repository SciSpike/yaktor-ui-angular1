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
      
      beautify = require('js-beautify').html,
      
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
    
    fs.writeSync(f, content)
    fs.closeSync(f);
  };
  
  function createScaffold(appname, states) {
    
    // Create the app directory
    fs.mkdirSync(appname);
    var projectPath = path.join(__dirname, appname);
    
    // Create app.js, view and controller directories
    var view = Object.keys(states).map(function(state, index) {
      return { name: state, url: new S(state).dasherize().s };
    });
    createTemplate(appname, 'app.js', {states: view});
    
    ['controller', 'view'].forEach(function(directory) {
      var appDirectory = path.join(appname, directory)
      fs.mkdirSync(appDirectory);
    }, this);
  };
  
  // Inside each state are one or more actionables that collect user input and
  // transition to another state. These actionable are composed of HTML fragments
  // with data-bindings to an AngularJS controller. The fragment should describe an
  // `onStateChange` function that manipulates a `state` property on the scope of
  // the controller and trigger a view update (probably via a route change).
  function createActionable(name, description) {
    // The description must have a `ui` and `elements` key. The `ui` key describes a parent
    // node, which should be generated last. The `elements` key should described at least one
    // explicit UI element (e.g. input, button, component).
    var elements = description.elements;
    
    var models = Object.keys(elements);
    
    var fragments = [];
    for (var el in elements) {
      
      // Each element should have a `ui` property that is mapped directly to an
      // HTML fragment (using json2html). `ui` must have a `tag` property.
      // TODO: Create a default `tag` property??
      
      fragmentDefinition = elements[el];
      var data = {state: name, model: el, name: new S(name).humanize()};
      var ui = fragmentDefinition.ui;
      
      // TODO: Generalize this further. For now we do explicit tag checking.
      // TODO: Impose a ng-model attribute for each fragment. Figure out a good way to 
      //       store this on the controller. These models will also need to be referenceable
      //       on the JS side.
      if (ui.tag === "button") {
        // TODO: Create mechanism to identify model changes (e.g. has an input field changed) or
        //       pass data changes via onStateChange function, as is being done below.
        data.model = models.join(', ');
        ui["ng-click"] = 'onStateChange("${state}", ${model})';
        ui.html = "${name}";
        
      } else {
        // Appending a model attribute to each element
        ui["ng-model"] = '${model}'
      }
      
      var fragment = json2html.transform(data, ui);
      fragments.push(fragment);
    }
    
    // Append fragments to parent node
    var data = { html: fragments.join('') };
    var ui = description.ui;
    ui.html = "${html}";
    
    return json2html.transform(data, ui);
  }
  
  // An application is described by many states. Each state defines UI elements
  // and provides actionables to expose other application states. This function
  // drives the UI generation for a specifed state.
  function createState(statename, description) {
    
    // Every state description must have an `element` key.
    
    // Generate the most deeply nested child node first, and work
    // up the heirarchy until reaching the top-level parent tag.
    var elements = description.elements;
    var actionables = [];
    
    // Create an subtitle
    var data = { state: new S(statename).humanize() };
    var ui = { "tag": "h2", "html": "${state}" };
    actionables.push(json2html.transform(data, ui));
    
    for (var name in elements) {
      var actionable = createActionable(name, elements[name]);
      actionables.push(actionable);
    }
    
    // Create a parent node
    // TODO: Determine if we want to defined this node here or in the spec.
    //       If we define here, then make ui a constant.
    data = { html: actionables.join(''), state: statename };
    ui = {
      "tag": "div",
      "class": "state",
      "ng-if": 'state=="${state}"',
      "html": "${html}"
    };
    
    return json2html.transform(data, ui);
  }
  
  // Parse an application spec, and drive UI generation
  function createApp(appname, states) {
    var name, nextState;
    
    var stateElements = [];
    for (name in states) {
      var description = states[name];
      
      var state = createState(name, description);
      stateElements.push(state);
    }
    
    console.log(beautify(stateElements.join('')));
    return beautify(stateElements.join(''));
  }
  
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
    createTemplate(appname, 'bower.json');
    
    var html = createApp(appname, states);
    
    var f = fs.openSync(path.join(appname, 'view', 'main.html'), 'w');
    fs.writeSync(f, html);
    fs.closeSync(f);
    
    // TODO: Since object keys may be arranged in any order, this does not provide a reliable way to
    //       get the initial state. This might require changing the JSON spec to specify states as
    //       an array of objects instead of an object.
    var initialState = Object.keys(states)[0];
    createTemplate(appname, path.join('controller', 'MainCtrl.js'), {initialState: initialState});
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