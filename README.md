Generate AngularJS applications based on a JSON application grammar.

> NOTE: Please report issues at https://github.com/SciSpike/yaktor-issues/issues.

## Usage

A yaktor-ui  is automatically generated from `cl` files. The generated files include a `public/api` containing an application's state matrix and various view descriptions. From the api we generate a client side application using.

```
yaktor-ui create
```

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

#### Issues

* In views schema, don't know how to handle array type. Enums with checkboxes are fine, but an open ended array is a bit more difficult to auto-generate aesthetically.
* View names in view schema are mapped to state names and URLs in the Angular application. They should not contain slashes and extensions. I'm removing them now, but it's not general enough code to handle all cases of a view name.
* When posting using views, the code assumes the endpoint is the same as the page name (e.g. in views.js /page.html is formatted to a state name of page and an endpoint of /page)

#### TODO:

* Fix bug when generating from root directory
* Expect view key to be a valid URL. Parse accordingly.
* Alt text
* ARIA support
