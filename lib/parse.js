(function() {
  
  // Generate a UI model based on a SciSpike generated state matrix.
  
  var fs = require('fs'),
      path = require('path'),
      S = require('string'),
      beautify = require('js-beautify').js;
  
  titlize= function(daString) {
    var s = daString.replace(/(\-|_|\s)+(.)?/g, function(mathc, sep, c) {
      return (c ? " "+c.toUpperCase() : '');
    });
    return s;
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
    delete definition.type;
    
    // Handle enum type
    if ( definition.hasOwnProperty('enum') ) {
      element.type = "enum";
      definition.options = definition.enum;
      
      // Use radio buttons when only few options described
      if (definition.enum.length < 4) {
        element.type = "radio";
      }
      delete definition.enum;
      
      element.ui = definition;
    } else if (element.type === "number") {
      // Handle number type
      
      element.ui = {
        tag: "input",
        type: "number"
      };
      
      for (var key in definition) {
        element.ui[key] = definition[key];
      }
      
    } else if (element.type === "string") {
      // Handle string type
      
      element.ui = {
        tag: "input",
        type: "text"
      };
      
      for (var key in definition) {
        element.ui[key] = definition[key];
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
      
      if(property.type){
        //should call createElement();
        elements[name] = {
            type: property.type,
            ui: {
              tag: 'input',
              type: property.type === 'integer' ? 'number' : 'text'
            }
        };
      } else {
        // TODO: it's an object. 
      }
    }
    var actions = {};
    // Create a default action (i.e submit button that will trigger a POST)
    if (Object.keys(elements).length > 0) {
      actions[actionName] = {
        type: "submit",
        ui: {
          title: titlize(new S(actionName).underscore().capitalize().s)
        }
      }
    }
    
    return {
        elements:elements,
        actions:actions
    };
  }
  
  function createView(view) {
    var actions = {};
    for (var name in view.states) {
      var vs = view.states[name];
      actions[name] = {
        ui: {
          tag: "div",
          title: titlize(new S(name.replace(/.*state:(.*)/,"$1")).underscore().capitalize().s)
        },
        subPath:vs.subPath?vs.subPath:null,  
        components: createActionElements(name, view.states[name])
      }
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
      states[stateName].friendly=stateName.replace(/(?:\/|\.)/gi,"_")
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