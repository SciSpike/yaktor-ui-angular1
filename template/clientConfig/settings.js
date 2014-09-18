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
        'radio': 'radio',
        'boolean': 'boolean',
        'array': 'checkbox'
      }
    },
    'theme': 'default'
  });