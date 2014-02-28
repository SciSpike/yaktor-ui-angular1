(function() {
  
  // Generate a UI model based on a SciSpike generated state matrix.
  
  var fs = require('fs'),
      path = require('path'),
      S = require('string'),
      beautify = require('js-beautify').js;
  
  titlize= function(daString) {
    var s = daString.replace(/(\-|_|\s)+(.)?/g, function(match, sep, c) {
      return (c ? (sep?" ":'')+c.toUpperCase() : '');
    });
    s = s.replace(/(.)/,function(match,c){
      return (c ? c.toUpperCase():'');
    })
    return s.trim();
  }
  parse = {};
  
  //
  //  State Matrix Parsing Routines
  //
  
  // TODO: Make this readable.
  function createElement(name, definition) {
    var element = {};
    
    // Pass `type` key to `ui` object
    element.type = definition.type;
    // Handle enum type
    if ( definition.hasOwnProperty('enum') ) {
      delete definition.type;
      element.type = "enum";
      definition.options = definition.enum;
      
      // Use radio buttons when only few options described
      if (definition.enum.length < 4) {
        element.type = "radio";
      }
      delete definition.enum;
      
      element.ui = definition;
      element.ui.title= titlize(name);
    } else if (element.type === "number") {
      // Handle number type
      
      element.ui = {
        title: titlize(name),
        tag: "input",
        type: "number"
      };
      
      delete definition.type;
      for (var key in definition) {
        element.ui[key] = definition[key];
      }
      
    } else if (element.type === "integer") {
      // Handle number type
      
      element.ui = {
        title: titlize(name),
        tag: "input",
        type: "number"
      };
      
      delete definition.type;
      for (var key in definition) {
        element.ui[key] = definition[key];
      }
      
    } else if (element.type === "string") {
      // Handle string type

      element.ui = {
          title: titlize(name),
        tag: "input",
        type: "text"
      };
      
      delete definition.type;
      for (var key in definition) {
        element.ui[key] = definition[key];
      }
      
    } else if (element.type === "date") {
      // Handle string type

      element.ui = {
          title: titlize(name),
        tag: "input",
        type: "date"
      };
      
      delete definition.type;
      for (var key in definition) {
        element.ui[key] = definition[key];
      }
      
    } else if (definition.type === "array" && definition.items.type){
      element.components={ 
          elements:{
          }
        };
      element.ui = {};
      element.ui.title= titlize(name);
      element.components.elements[name]=createElement(name,definition.items);
    } else if (definition.type === "array" || definition.properties){
      element.components={ 
        elements:{
        }
      };
      element.ui = {};
      element.ui.title= titlize(name);
      var props = definition.items?definition.items.properties:definition.properties;
      for(prop in props){
        element.components.elements[prop]=createElement(prop,props[prop]);
      }
    }
    return element;
  }
  
  
  
  
  
  
  
  
  //
  // View Parsing Routines
  //
  
  function createActionElements(actionName, description) {
    var elements = {};
    var properties = description.type?description.type.properties:{};
    
    for (var name in properties) {
      var property = properties[name];
      elements[name] = createElement(name,property);
    }
    var actions = {};
    // Create a default action (i.e submit button that will trigger a POST)
    actions[actionName] = {
      type: "submit",
      ui: {
        title: titlize(actionName)
      }
    }
    return {
        elements:elements,
        actions:actions
    };
  }
  
  function createView(view) {
    var actions = {};
    for (var name in view.actions) {
      var vs = view.actions[name];
      actions[name] = {
        ui: {
          tag: "div",
          title: titlize(name.replace(/.*state:(.*)/,"$1"))
        },
        subPath:vs.subPath?vs.subPath:null,  
        components: createActionElements(name, view.actions[name])
      };
    }
    return {
      proto:view.endpoint.replace(/([^:]*:\/\/).*/,'$1'),
      url:view.endpoint.replace(/[^:]*:\/\//,''),
      elements: actions
    };
  }
  
  // Need to map the view structure into the existing state structure that generates Angular applications
  // Each view corresponds to a state, with multiple transition states (or actions in this case).
  function createViews(views) {
    var states = {};
    
    for (var name in views) {
      var stateName = name;
      states[stateName] = createView(views[name]);
      var friendly = states[stateName].friendly=stateName.replace(/(?:\/|\.)/gi,"_");
      states[stateName].title=titlize(friendly.replace(/.*:state:/,""));
    }
    return states;
  }
  
  parse.fromViews = function(appname, views,debug) {
    
    var model = {
      name: appname,
      states: createViews(views),
      REST: true
    };
    
    if(debug){
      fs.writeFileSync(appname + "Model.json", beautify( JSON.stringify(model) ));
    }
    
    return model;
  }
  
  module.exports = parse;
}());