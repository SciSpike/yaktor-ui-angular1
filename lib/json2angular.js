(function() {
      
  var fs = require('fs'),
      path = require('path'),
      ansi = require('ansi'),
      cursor = ansi(process.stdout),
      S = require('string'),
      json2html = require('node-json2html'),
      beautify = require('js-beautify').html,
      mustache = require('mustache');
  
  var json2angular = {};
  
  // Define useful constants
  var FRAGMENTPATH = path.join(__dirname, '..', 'template', 'fragment');
  
  // TODO: Move to utils file
  function getTemplatePath(file) {
    return path.join(__dirname, '..', 'template', file);
  };
  
  function dasherize(name) {
    return name.toLowerCase().replace(/\s+/g, '-');
  };
  
  String.prototype.toCamel = function(){
  	return this.replace(/(\-[a-z])/g, function($1){return $1.toUpperCase().replace('-','');});
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
  
  json2angular.createUITemplate = function(view) {
    if (!view) return;
    
    view.dashed = function() {
      return this.action.toLowerCase().replace(/\s+/g, '-');
    }
    var templatePath = path.join(__dirname, '..', 'template', 'view', 'snippet', 'ui.html');
    var template = fs.readFileSync(templatePath, 'utf8');
    return mustache.render(template, view);
  };
  
  json2angular.createStateTemplate = function(state) {
    
    // Generate interface template of the state
    var uiTemplate = json2angular.createUITemplate(state.ui);
    
    var templatePath = path.join(__dirname, '..', 'template', 'view', 'snippet', 'state.html');
    var template = fs.readFileSync(templatePath, 'utf8');
    
    var view = {
      "title": state.title,
      "dashed": function() {
        return this.title.toLowerCase().replace(/\s+/g, '-');
      },
      "ui": uiTemplate
    }
    
    return mustache.render(template, view);
  };
  
  function createMain(appname, states) {
    
    stateTemplates = [];
    states.forEach(function(state) {
      var template = json2angular.createStateTemplate(state);
      stateTemplates.push(template);
    }, states);
    
    var f = fs.openSync(path.join(appname, 'view', 'main.html'), 'w');
    var content = stateTemplates.join('\n');
    
    fs.writeSync(f, content);
    fs.closeSync(f);
    
    // MainCtrl
    createTemplate(appname, path.join('controller', 'MainCtrl.js'), {initialState: dasherize(states[0].title)});
  };
  
  function getFragment() {
    return fs.readFileSync(path.join(FRAGMENTPATH, 'simple.html'), 'utf8'); 
  }
  
  function createUIFragment(name, definition, nextState) {
    // `definition` must specify a ui property
    
    var ui = definition.ui;
    delete definition.ui;
    
    // TODO: Generalize this further. For now we do explicit tag checking
    if (ui.tag === "button") {
      ui['ng-click'] = "onState('${state}')"
    }
    
    // TODO: Use definition to build more complex UIs
    for (attr in definition) {}
    
    var data = {state: nextState};
    
    return json2html.transform(data, ui);
  }
  
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
    
    appname = appname.toCamel().replace(/\s+/g, '');
    
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
    // createMain(appname, states);
    
    var html = createApp(appname, states);
    
    var f = fs.openSync(path.join(appname, 'view', 'main.html'), 'w');
    fs.writeSync(f, html);
    fs.closeSync(f);
  };
  
  // This is the driver starting the AngularJS code generation.
  json2angular.exec = function(schemaFile) {
    
    // TODO: Validate schema
    fs.readFile(schemaFile, 'utf8', function(err, data) {
      var schema = JSON.parse(data);
      createProject(schema.name, schema.states);
    });
  };
  
  module.exports = json2angular;
}());