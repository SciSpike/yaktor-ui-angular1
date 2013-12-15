# schema2angular

Generate AngularJS applications based on a JSON application grammer.

## Usage

  json2angular -s [schema]

## Development

`json2angular` is a Node module to generate AngularJS projects based on a JSON specification. The module consumes a JSON file describing the application title and states. Each state is coupled with UI elements, and information about how those UI elements affect the application state.

This module uses two mechanisms for code generation.

  * [Mustache](https://npmjs.org/package/mustache) is used to generate multiline HTML templates (e.g. `index.html`) and Javascript (e.g. `app.js`).
  * [json2html](http://json2html.com) is used to generate HTML fragments from a JSON definition.
  
Though `mustache` is great for generating large templates, it can become cumbersome when generating fragments. `json2html` provides a better solution for AngularJS fragments since:

    1) it provides a more readable fragment definition (especially when considering AngularJS's curly-braces syntax)
    2) the fragment definition is directly borrowed from the application JSON specification.


## JSON Specification

    * The application name is stored on the root level, and specified by the `name` key
    * States are store in a JSON object. The key represents the state name.
    * Each state must have a `ui` and `elements` key.
    * The `ui` key specifies the HTML fragment to generate
    * The `elements` key specifies child nodes
    * Each child node is a container of UI elements associated with another state
    * It must contain a `ui` key to generate another HTML fragment, and may contain an additional `elements` key


An application is described by a well-structure JSON specification, which is defined as a [JSON Schema](http://json-schema.org/). This allows AngularJS applications to be generated with minimal programming. The JSON spec is still in flux, so feel free to suggest/make improvements.

### Rules

The JSON must:

  * provide a `name` key at the top level with an application name. This will be inserted in the appropriate format (e.g. dashed, camel cased) throughout the project code.
  * provide a `states` key at the top level containing an object of application states. Each key of the state object must be a state name.

Each state object must:

  * provide a `ui` key describing an HTML container for all child nodes.
  * provide an `elements` key describing all possible state transitions from the current state.

Each state transition must:

  * provide a `ui` key describing an HTML container for all child nodes.
  * provide an `elements` key describing an HTML fragment related to a specific UI element.



### Example

    {
      "name": "Soda Purchaser",
      "states": {
        "state1": {
          "ui": {
            "tag": "div",
            "title": "State 1 Container"
          },
          "elements": {
            "state2": {
              "ui": {
                "tag": "div",
                "title": "Container for UI elements related to state2 transition."
              },
              "elements": {
                "descriptiveName": {
                  "ui": {
                    "tag": "input",
                    "type": "text"
                  }
                },
                "someOtherName": {
                  "ui": {
                    "tag": "checkbox",
                  }
                }
                "action": {
                  "ui": {
                    "tag": "button",
                    "event": "click"
                  }
                }
              }
            }
          }
        },
        "state2": {},
        "state3": {},
      }
    }
