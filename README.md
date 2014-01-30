# json2angular

Generate AngularJS applications based on a JSON application grammar.

## Usage

A SciSpike application is automatically generated from a `.cdsl` file. The generated files include an `allInOne.js` file containing an application's state matrix and various view descriptions located in subdirectories of `public`. `json2angular` is able to generated a client side application using either mechanism.

### State Matrix Usage

    json2angular -n "Application Name" -s allInOne.js

### Views Usage

    json2angular -n "Application Name" -d scispike-app/public

In each case, the `json2angular` utility creates an intermediary user interface model that is used to generate an [AngularJS](http://angularjs.org/) application. This intermediary UI model is described in [JSON Specification](##JSON Specification)

## Development

`json2angular` is a Node module to generate AngularJS projects based on a JSON specification. The module consumes a JSON file describing the application title and states. Each state is coupled with UI elements, and information about how those UI elements affect the application state.

This module uses two mechanisms for code generation.

  * [Mustache](https://npmjs.org/package/mustache) is used to generate multiline HTML templates (e.g. `index.html`) and Javascript (e.g. `app.js`).
  * [json2html](http://json2html.com) is used to generate HTML fragments from a JSON definition.
  
Though `mustache` is great for generating large templates, it can become cumbersome when generating fragments. `json2html` provides a better solution for AngularJS fragments since:

  * it provides a more readable fragment definition (especially when considering AngularJS's curly-braces syntax)
  * the fragment definition is directly borrowed from the application JSON specification.


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


#### Convention

* Use Socket API when generating Angular app from allInOne.js
* Use REST API when generating Angular app from views.js
* Create tabbed view for each state using multiple pages (e.g. /has-money shows both actions whereas /has-money/selection shows only selection)
* Create UI model from views.js (POST, GET, FIND, etc)
* 

#### Issues

* In views schema, don't know how to handle array type. Enums with checkboxes are fine, but an open ended array is a bit more difficult to auto-generate aesthetically.
* View names in view schema are mapped to state names and URLs in the Angular application. They should not contain slashes and extensions. I'm removing them now, but it's not general enough code to handle all cases of a view name.
* When posting using views, the code assumes the endpoint is the same as the page name (e.g. in views.js /page.html is formatted to a state name of page and an endpoint of /page)

#### TODO:

* Expect view key to be a valid URL. Parse accordingly.
* Crawl the public directory for view.js files
* Field labels
* Column layout with field labels and form elements
* Alt text
* ARIA support

json2angular -d directory