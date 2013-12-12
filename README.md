# schema2angular

Generate an AngularJS application based on a JSON application grammer.

### Usage

  json2angular [appname] [schema]

## Example JSON Structure (in-progress)

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
