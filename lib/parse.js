(function() {
  
  // Generate a UI model based on a SciSpike generated state matrix.
  
  var fs = require('fs'),
      path = require('path'),
      S = require('string'),
      beautify = require('js-beautify').js;
  
  parse = {};
  
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
  
  function createElements(definition) {
    var transitionElements = {};
    
    for (var name in definition) {
      var elements = {};
      
      var transitionState = definition[name];
      var transitionStateName = new S(name);
      
      // Check if any properties are defined on the transition state. These properties
      // are used to describe UI elements in the UI model.
      if (transitionState.hasOwnProperty('type')) {
        
        // Assuming we don't need to check for the properities flag.
        var properties = transitionState.type.properties;
        
        for (var key in properties) {
          var property = properties[key];
          elements[key] = createElement(key, property);
        }
      }
      
      // Create a default action (i.e submit button that will trigger a POST)
      if (Object.keys(elements).length > 0) {
        elements["defaultAction"] = {
          type: "submit",
          ui: {
            title: transitionStateName.humanize().s
          }
        }
      }
      
      transitionElements[name] = {
        ui: {
          tag: "div",
          title: transitionStateName.humanize().s
        },
        elements: elements || {}
      }
      
    }
    
    return transitionElements;
  }
  
  function createTransitionState(name, definition) {
    name = new S(name);
    
    var state = {
      elements: createElements(definition)
    };
    
    return state;
  }
  
  function createStates(matrix) {
    var states = {};
    
    for (var name in matrix) {
      states[name] = createTransitionState(name, matrix[name]);
    }
    
    return states;
  }
  
  parse.fromStateMatrix = function(appname, matrix) {
    
    // Create an object with the project name
    var model = {
      name: appname,
      states: createStates(matrix)
    };
    
    var f = fs.openSync(appname + "Model.json", 'w');
    fs.writeSync(f, beautify( JSON.stringify(model) ));
    fs.closeSync(f);
    
    return model;
  }
  
  parse.createElement = createElement;
  parse.createElements = createElements;
  parse.createTransitionState = createTransitionState;
  parse.createStates = createStates;
  
  module.exports = parse;
}());