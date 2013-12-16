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
  
  // Define useful constants
  var FRAGMENTPATH = path.join(__dirname, '..', 'template', 'fragment');
  
  // TODO: Move to utils file
  function getTemplatePath(file) {
    return path.join(__dirname, '..', 'template', file);
  };
  
  function createTemplate(appname, filename, view) {
    
    // Handle the Mustache view
    view = !view ? {} : view
    view.appname = appname
    
    var filepath = getTemplatePath(filename);
    var source = fs.readFileSync(filepath, 'utf8');
    var f = fs.openSync(path.join(appname, filename), 'w');
    var content = mustache.render(source, view);
    
    fs.writeSync(f, content)
    fs.closeSync(f);
  };
  
  function createScaffold(appname) {
    
    // Create the app directory
    fs.mkdirSync(appname);
    var projectPath = path.join(__dirname, appname);
    
    // Create app.js, view and controller directories
    createTemplate(appname, 'app.js');
    
    ['controller', 'view'].forEach(function(directory) {
      var appDirectory = path.join(appname, directory)
      fs.mkdirSync(appDirectory);
    }, this);
  };
  
  function createUIFragment(name, definition, nextState) {
    // `definition` must specify a ui property
    
    var ui = definition.ui;
    delete definition.ui;
    
    // TODO: Generalize this further. For now we do explicit tag checking
    if (ui.tag === "button") {
      ui['ng-click'] = 'onState("${state}")'
    }
    
    // TODO: Use definition to build more complex UIs
    for (attr in definition) {}
    
    var data = {state: nextState};
    return json2html.transform(data, ui);
  }
  
  // Parse an application spec, and drive UI generation
  // TODO: Too many nested layers here. Break out logic into 
  //       more simplifed and descriptive functions.
  function createApp(appname, states) {
    var key1, nextState;
    
    var stateElements = [];
    for (key1 in states) {
      // Each state must specify a `ui` and `elements` key
      
      var state = states[key1];
      var elements = state.elements;
      
      var containers = [];
      for (nextState in elements) {
        // Each subsequent state must specify a `ui` and `elements` key
        
        var defn = elements[nextState];
        
        var ui = defn.ui;
        var widgets = defn.elements;
        
        // Each widget should produce an HTML fragment
        var fragments = [];
        for (name in widgets) {
          var fragment = createUIFragment(name, widgets[name], nextState);
          fragments.push(fragment);
        }
        ui.html = "${fragments}";
        container = json2html.transform({fragments: fragments.join('')}, ui);
        containers.push(container);
      }
      var ui = state.ui;
      ui.html = "${containers}";
      ui['ng-if'] = 'state=="${state}"';
      var stateElement = json2html.transform({containers: containers.join(''), state: key1}, ui);
      stateElements.push(stateElement);
    }
    return beautify(stateElements.join(''))
  }
  
  function createProject(appname, states) {
    
    appname = new S(appname);
    appname = appname.camelize().s;
    
    // First check if the app name exists in the filesystem
    if (fs.existsSync(appname)) {
      cursor.red();
      console.log("The application name " + appname + " already exists.");
      cursor.reset();
      return;
    }
    
    createScaffold(appname);
    createTemplate(appname, 'index.html');
    createTemplate(appname, 'bower.json');
    
    var html = createApp(appname, states);
    
    var f = fs.openSync(path.join(appname, 'view', 'main.html'), 'w');
    fs.writeSync(f, html);
    fs.closeSync(f);
    
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
      console.log(isValid);
      
      // TODO: Perhaps use a single variable
      createProject(spec.name, spec.states);
    });
  };
  
  module.exports = json2angular;
}());