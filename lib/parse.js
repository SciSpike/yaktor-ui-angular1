(function() {
  
  // Generate a UI model based on a SciSpike generated state matrix.
  
  var fs = require('fs'),
      path = require('path'),
      S = require('string'),
      beautify = require('js-beautify').js;
  
  parse = {};
  
  function createElement(name, definition) {
    console.log('createElement', name, definition);
    
    if ( definition.hasOwnProperty('enum') ) {
      definition.type = "enum";
    }
    
    return definition;
  }
  
  function createElements(definition) {
    var elements = {};
    
    for (var name in definition) {
      var transitionState = definition[name];
      
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
    }
    
    return elements;
  }
  
  function createTransitionState(name, definition) {
    name = new S(name);
    
    var state = {
      ui: {
        tag: "div",
        title: name.humanize().s
      },
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
  
  parse.createTransitionState = createTransitionState;
  parse.createStates = createStates;
  
  module.exports = parse;
}());