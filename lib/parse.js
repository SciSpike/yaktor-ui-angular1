(function() {
  
  // Generate a UI model based on a SciSpike generated state matrix.
  
  var fs = require('fs'),
      path = require('path'),
      S = require('string'),
      beautify = require('js-beautify').js,
      titlize= function(daString) {
		    //stop shouting
		    daString = daString.replace(/^([A-Z]*)$/, function(match, c) {
		      return (c ? c.toLowerCase():'');
		    });
		    //prepare camels for _
		    daString = daString.replace(/([A-Z])/g, function(match, c) {
		      return (c ? "_"+c:'');
		    });
		    //convert to " "
		    daString = daString.replace(/(\-|_|\s)+(.)?/g, function(match, sep, c) {
		      return (c ? (sep?" ":'')+c.toUpperCase() : '');
		    });
		    //capitalize
		    daString = daString.replace(/(.)/,function(match,c){
		      return (c ? c.toUpperCase():'');
		    })
		    //clean up
		    return daString.trim();
	  },
	  parse = {};

  function createElement(name, definition,typeRefs) {
    var element = {};
    
    // Pass `type` key to `ui` object
    element.type = definition.type || "object";
    if(definition.$typeRef){
      element.typeRef = definition.$typeRef;
      typeRefs[definition.$typeRef]=true;
    } 
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
      
    } else if (element.type === "boolean") {
      // Handle number type
      
      element.ui = {
        title: titlize(name),
        tag: "input",
        type: "boolean"
      };
      element.type="checkbox"
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
      element = createElement(name,definition.items,typeRefs);
      element.typeWrapper='array';
    } else if (definition.type === "array" || definition.properties){
      element.components={ 
        elements:{
        }
      };
      element.ui = {};
      element.ui.title= titlize(name);
      var props = definition.items?definition.items.properties:definition.properties;
      for(prop in props){
        element.components.elements[prop]=createElement(prop,props[prop],typeRefs);
      }
    }
    return element;
  }
  
  function createActionElements(actionName, description,typeRefs) {
    var elements = {};
    var properties = description.type?description.type.properties:{};
    
    for (var name in properties) {
      var property = properties[name];
      elements[name] = createElement(name,property,typeRefs);
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
        actions:actions,
        typeRefs:typeRefs
    };
  }
  
  function createView(view) {
    var actions = {};
    var typeRefs = {};
    for (var name in view.actions) {
      var vs = view.actions[name];
      actions[name] = {
        ui: {
          tag: "div",
          title: titlize(name.replace(/.*state:(.*)/,"$1"))
        },
        subPath:vs.subPath?vs.subPath:null,
        typeRefs:typeRefs,  
        components: createActionElements(name, view.actions[name],typeRefs)
      };
    }
    return {
      proto:view.endpoint.replace(/([^:]*:\/\/).*/,'$1'),
      url:view.endpoint.replace(/[^:]*:\/\//,''),
      elements: actions
    };
  }
  
  /*function createViews(views) {
	    var states = {};
	    
	    for (var name in views) {
	      var stateName = name;
	      states[stateName] = createView(views[name]);
	      var friendly = states[stateName].friendly=stateName.replace(/(?:\/|\.)/gi,"_").replace(":state",".state").replace(/^_/,"");
	      states[stateName].title=titlize(friendly.replace(/.*.state:/,""));
	    }
	    return states;
  }*/

  var moduleObject = {
		  crud:[],
		  agents:[]
  };
  
  function createStateViews(states){
	  //console.log('----- 1 -----');
	  //console.log(states);
	  var newStates = [];
	  for(var i=0; i<states.length; i++){
		  var stateName = states[i].name;
		  var newState = createView(states[i]);
		  newState['name'] = stateName;
		  newState['title'] = titlize(stateName);
		  newStates.push(newState);
	  }
	  //console.log('----- 2 -----');
	  //console.log(newStates);
	  //console.log('----- 3 -----');
	  return newStates;
  }
  
  function createModules(modules) {
	  for(var moduleName in modules){
		  for(var moduleType in modules[moduleName]){
			  for(var i=0; i<modules[moduleName][moduleType].length; i++){
				  modules[moduleName][moduleType][i].actions = createView(modules[moduleName][moduleType][i]);
				  if(modules[moduleName][moduleType][i].states){
					  modules[moduleName][moduleType][i].states = createStateViews(modules[moduleName][moduleType][i].states);
				  }
				  moduleObject[moduleType].push(modules[moduleName][moduleType][i]);
			  }
		  }
	  }
	  return moduleObject;
  }
  
  parse.fromViews = function(appname, modules, debug) {
	  var model = {
			  name: appname,
			  title: titlize(appname),
			  modules: createModules(modules)
	  };
	  if(debug){
		  	fs.writeFileSync(appname + "Model.json", beautify( JSON.stringify(model) ));
	  }
	  return model;
  }
  
  module.exports = parse;
}());