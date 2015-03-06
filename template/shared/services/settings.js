angular.module('views')
  .provider('defaultSettings', function () {
    // default values
    var values = {
        'forms':{
          'elementTypes': {
            'string': 'text',
            'number': 'number',
            'enum': 'enum',
            'date': 'date',
            'toggle': 'toggle',
            'excMulti': 'radio',
            'radio': 'radio',
            'boolean': 'boolean',
            'incMulti': 'checkbox',
            'geo': 'geo',
            'array': 'array',
            'typeAhead': 'typeAhead',
            'select': 'select'
          }
        }
    };
    return {
      setElementTypes: function (constants) {
        angular.extend(values.forms.elementTypes, constants);
      },
      $get: function () {
        return values;
      }
    };
  })
  .factory('settingsInstances', function (defaultSettings, clientConstants) {
    var elementTypesInstances = {};
    var typrRefsInstances = {};
    var mergeObjects = function(destination, source){
      for (var property in source) {
        if (source[property] && source[property].constructor &&
         source[property].constructor === Object) {
          destination[property] = destination[property] || {};
          arguments.callee(destination[property], source[property]);
        } else {
          destination[property] = source[property];
        }
      }
      return destination;
    }
    var _getElementTypesInstance = function(instanceName, settings){
      if(elementTypesInstances[instanceName]){
        var instance = mergeObjects(elementTypesInstances[instanceName], settings);
        return instance;
      }else{
        var instance = mergeObjects(angular.copy(defaultSettings), settings);
        elementTypesInstances[instanceName] = instance;
        return elementTypesInstances[instanceName];
      }
    }
    var _getTypeRefsInstance = function(instanceName, settings){
      if(typrRefsInstances[instanceName]){
        var instance = mergeObjects(typrRefsInstances[instanceName], settings);
        return instance;
      }else{
        var instance = mergeObjects(angular.copy(clientConstants.refLookup), settings);
        typrRefsInstances[instanceName] = instance;
        return typrRefsInstances[instanceName];
      }
    }
    return{
      getElementTypesInstance: _getElementTypesInstance,
      getTypeRefsInstance: _getTypeRefsInstance
    }
  });