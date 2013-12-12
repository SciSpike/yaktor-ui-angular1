# schema2angular

Generate an AngularJS application based on a JSON application grammer.

### Usage

  json2angular -s [schema]

### Development

`json2angular` is a Node module for generate AngularJS projects based on a to-be-defined JSON schema. The module consumes a JSON schema describing the application title, and application states. Each state is coupled with UI elements, and information about how those UI element affect the application state.

In order to generate Angular code, the module uses [Mustache](https://npmjs.org/package/mustache) on file located in the `template` directory.

## Example JSON Structure (in-progress)
    
    {
      name: 'AppName',
      states: [
      {
        title: 'StateName1'
      }
      ]
    }
    
    [
      {
        state: 'state-1',
        interface: [
          {
            widget: 'input',
            type: 'text',
            data: 'widget1'
          },
          {
            widget: 'input',
            type: 'date',
            data: 'widget2'
          }
        ],
        data: {
          'widget1': 'some-value',
          'widget2': 
        }
      },
      {
        state: 'state-2',
        interface: [
          {}
        ],
        data: {}
      } 
    ]


###

Soda Purchase Example

* Initial State
* Spend Money
* Get Money Back
* Select Soda
* Happy
* Disappointed

1) Generate Service to store state of application
2) State Service is injected into each generated directive
3) 

Start Simpler

1) Generate State Service
2) Generate Template based on JSON structure
3) Generate Controller for data-binding
