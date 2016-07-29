;(function () {

  // Generate a UI model based on a SciSpike generated state matrix.

  var fs = require('fs'),
    path = require('path'),
    S = require('string'),
    titlize = function (daString) {
      // stop shouting
      daString = daString.replace(/^([A-Z]*)$/, function (match, c) {
        return (c ? c.toLowerCase() : '')
      })
      // prepare camels for _
      daString = daString.replace(/([A-Z])/g, function (match, c) {
        return (c ? '_' + c : '')
      })
      // convert to " "
      daString = daString.replace(/(\-|_|\s)+(.)?/g, function (match, sep, c) {
        return (c ? (sep ? ' ' : '') + c.toUpperCase() : '')
      })
      // capitalize
      daString = daString.replace(/(.)/, function (match, c) {
        return (c ? c.toUpperCase() : '')
      })
      // clean up
      return daString.trim()
    },
    parse = {};

  function createTypeAhead (name, definition, typeRefs, style) {
    // style options are typeAhead and select - for now
    var element = {}
    element.typeRef = definition.$typeRef
    typeRefs[definition.$typeRef] = true
    element.type = style
    element.ui = {
      '$typeRef': definition.$typeRef,
      'type': style,
      'title': titlize(name)
    }
    // if (definition.properties && definition.properties.title){
    element.ui.hasTitle = true
    // }else{
    // element.ui.hasTitle = false
    // }
    return element
  }

  function createElement (name, definition, typeRefs, requiredFields) {
    var element = {
      required: false
    }
    if (definition.type === 'string') {
      element.type = 'text'
    }

    if (definition.format == 'date-time') {
      element.type = 'date'
    }else {
      element.type = definition.type || 'object'
    }
    element.name = name

    if (definition.$typeRef) {
      element = createTypeAhead(name, definition, typeRefs, 'select')
    }

    if (definition.metaType == 'geo') {
      element.type = 'geo'
    }

    if (definition.hasOwnProperty('enum')) {
      delete definition.type
      element.type = 'enum'
      definition.options = definition.enum
      if (definition.enum.length < 4) {
        element.type = 'radio'
      }
      delete definition.enum
      element.ui = definition
      element.ui.title = titlize(name)
    }

    if (definition.type === 'integer') {
      element.type = 'number'
    }
    if (definition.type === 'array' && definition.items && definition.items.type && !definition.$typeRef) {
      element.ui = definition
      element.ui.title = titlize(name)
      if (definition.items.$typeRef) {
        definition.$typeRef = definition.items.$typeRef
        element = createTypeAhead(name, definition, typeRefs, 'arrayselect')
      }
    } else if (definition.type === 'array' || definition.properties && !definition.$typeRef) {
      element.components = {
        elements: {}
      }
      element.ui = {}
      element.ui.title = titlize(name)

      var props = definition.items ? definition.items.properties : definition.properties
      for (prop in props) {
        element.components.elements[prop] = createElement(prop, props[prop], typeRefs, definition.required)
      }
    } else if (definition.$typeRef) {
      // don't mess with it for the moment
    } else {
      element.ui = definition
      element.ui.title = titlize(name)
      element.ui.type = element.type
    }


    if (requiredFields) {
      for (var i = 0; i < requiredFields.length; i++) {
        if (name == requiredFields[i]) {
          element.required = true
          break
        }else {
          element.required = false
        }
      }
    }
    return element
  }

  function createActionElements (actionName, description, typeRefs) {
    var type = description.type || {}
    var requiredFields = type.required || []
    var elements = {}
    var properties = type.properties || {}
    for ( var name in properties) {
      var property = properties[name]
      elements[name] = createElement(name, property, typeRefs, requiredFields)
    }
    var actions = {}
    // Create a default action (i.e submit button that will trigger a POST)
    actions[actionName] = {
      type: 'submit',
      ui: {
        title: titlize(actionName)
      }
    }

    return {
      elements: elements,
      actions: actions,
      typeRefs: typeRefs
    }
  }

  function createView (view) {
    var actions = {}
    var typeRefs = {}
    for ( var name in view.actions) {
      var vs = view.actions[name]
      actions[name] = {
        ui: {
          tag: 'div',
          title: titlize(name.replace(/.*state:(.*)/, '$1'))
        },
        subPath: vs.subPath ? vs.subPath : null,
        typeRefs: typeRefs,
        components: createActionElements(name, view.actions[name], typeRefs)
      }
    }
    return {
      proto: view.endpoint.replace(/([^:]*:\/\/).*/, '$1'),
      url: view.endpoint.replace(/[^:]*:\/\//, ''),
      elements: actions
    }
  }

  /*
   * function createViews(views) { var states = {}
   * 
   * for (var name in views) { var stateName = name; states[stateName] =
   * createView(views[name]); var friendly =
   * states[stateName].friendly=stateName.replace(/(?:\/|\.)/gi,"_").replace(":state",".state").replace(/^_/,"")
   * states[stateName].title=titlize(friendly.replace(/.*.state:/,"")); } return
   * states; }
   */

  var moduleObject = {
    crud: [],
    agents: []
  }

  function createStateViews (states) {
    var newStates = []
    for (var i = 0; i < states.length; i++) {
      var stateName = states[i].name
      var newState = createView(states[i])
      newState['name'] = stateName
      newState['title'] = titlize(stateName)
      newStates.push(newState)
    }
    return newStates
  }

  function createModules (modules) {
    for ( var moduleName in modules) {
      for ( var moduleType in modules[moduleName]) {
        for (var i = 0; i < modules[moduleName][moduleType].length; i++) {
          modules[moduleName][moduleType][i].actions = createView(modules[moduleName][moduleType][i])
          if (modules[moduleName][moduleType][i].states) {
            modules[moduleName][moduleType][i].states = createStateViews(modules[moduleName][moduleType][i].states)
          }
          moduleObject[moduleType].push(modules[moduleName][moduleType][i])
        }
      }
    }
    return moduleObject
  }

  parse.fromViews = function (appname, modules, debug) {
    var model = {
      name: appname,
      title: titlize(appname),
      modules: createModules(modules)
    }
    if (debug) {
      fs.writeFileSync(appname + 'Model.json', JSON.stringify(model, null, 2))
    }
    return model
  }

  module.exports = parse
}())
