(function() {
  
  var argv = require('optimist').argv;
      fs = require('fs'),
      path = require('path'),
      ansi = require('ansi'),
      cursor = ansi(process.stdout),
      mustache = require('mustache');
  
  // TODO: Require appname and schema using Optimist handlers
  var appname = argv._[0]
  var schema = argv._[1]
  var generator = {};
  
  function getTemplatePath(file) {
    return path.join(__dirname, '..', 'template', file);
  };
  
  function dasherize(name) {
    return name.toLowerCase().replace(/\s+/g, '-');
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
  
  function createMain(schema) {
    
    // Parse schema
    var source = fs.readFileSync(schema, 'utf8');
    schema = JSON.parse(source);
    
    // main.html
    var template = "{{#states}}\
<div ng-if=\"state=='{{dasherize}}'\"><p>{{title}}</p></div>\n\
{{/states}}";
      
    var view = {
      "states": schema,
      "dasherize": function() {
        return this.title.toLowerCase().replace(/\s+/g, '-');
      }
    };
    
    var f = fs.openSync(path.join(appname, 'view', 'main.html'), 'w');
    var content = mustache.render(template, view);
    
    fs.writeSync(f, content);
    fs.closeSync(f);
    
    // MainCtrl
    createTemplate(appname, path.join('controller', 'MainCtrl.js'), {initialState: dasherize(schema[0].title)});
  };
  
  function createProject(appname, schema) {
    
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
    createMain(schema);
  };
  
  generator.exec = function() {
    if (!appname || !schema) {
      cursor.red();
      // TODO: Use Optimist for argument catching and usage info
      console.log("Provide an appname and scheme!");
      cursor.reset();
      return;
    }
    
    createProject(appname, schema)
  };
  
  module.exports = generator;
}());