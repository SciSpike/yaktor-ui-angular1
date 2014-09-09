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
				'radio': 'radio'
			}
		},
		'theme': 'default'
	});