(function() {
  
  // Generate a UI model based on a SciSpike generated state matrix.
  
  var fs = require('fs'),
      path = require('path'),
      S = require('string'),
      beautify = require('js-beautify').js;
  
  parse = {};
  
  function createElement(name, definition) {
    var element = {};
    
    // Pass `type` key to `ui` object
    element.type = definition.type;
    
    // Handle enum type
    if ( definition.hasOwnProperty('enum') ) {
      element.type = "enum";
      definition.options = definition.enum;
      
      // Use radio buttons when only few options described
      if (definition.enum.length < 4) {
        element.type = "radio";
      }
      delete definition.enum;
    }
    
    
    delete definition.type;
    element.ui = definition;
    
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