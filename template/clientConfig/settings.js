angular.module('views')
  .constant('clientSettings', {
    'forms':{
      'elementTypes': {
        'string': 'text',
        'number': 'number',
        'enum': 'enum',
        'date': 'date',
        'integer': 'integer',
        'toggle': 'toggle',
        'excMulti': 'radio',
        'boolean': 'boolean',
        'incMulti': 'checkbox',
        'geo': 'geo',
        'array': 'array'
      }
    },
    'theme': 'default'
  });