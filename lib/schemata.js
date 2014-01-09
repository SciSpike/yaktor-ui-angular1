
var schemata = {};

schemata.app = {
  "$schema": "http://json-schema.org/draft-04/schema#",
  "title": "application",
  "description": "A grammar to generate dynamic and stateful client applications",
  "type": "object",
  "properties": {
    "name": {
      "description": "The application name",
      "type": "string"
    },
    "states": {
      "patternProperties": {
        ".*":  {
          "$ref":"#/definitions/state"
        }
      },
      "uniqueItems": true
    }
  },
  "required": ["name", "states"],
  "additionalProperties": false,
  
  "definitions": {
    
    "state": {
      "description": "A state containing a description of embedded UI components",
      "type": "object",
      "properties": {
        "elements": {
          "patternProperties": {
            ".*": {
              "$ref": "#/definitions/element"
            }
          }
        }
      },
      "required": ["elements"],
      "additionalProperties": false,
    },
    
    "element": {
      "description": "A description of UI components for a single state transition",
      "type": "object",
      "properties": {
        "ui": {
          "$ref": "#/definitions/ui",
        },
        "elements": {
          "patternProperties": {
            ".*": {
              "$ref": "#/definitions/actionable"
            }
          }
        }
      },
      "required": ["ui", "elements"],
      "additionalProperties": false
    },
    
    "ui": {
      "description": "A description for a parent HTML element that contains child HTML fragments",
      "type": "object",
      "properties": {
        "tag": {
          "enum": ["div", "section", "article"],
        }
      },
      "additionalProperties": true,
      "required": ["tag"]
    },
    
    "actionable": {
      "description": "",
      "type": "object",
      "properties": {
        "ui": {
          "patternProperties": {
            ".*": {
              "$ref": "#/definitions/actionableUI"
            }
          }
        },
        "type": {
          "enum": ["string", "number", "date", "integer", "enum", "toggle", "checkbox", "radio", "submit"]
        }
      },
      "required": ["ui", "type"]
    },
    
    "actionableUI": {
      "description": ""
    }
  }
  
};

// schemata.state = {
//   "$schema": "/state",
//   "id": "/state",
//   "title": "state",
//   "description": "A schema for an application state",
//   "type": "object",
//   "properties": {
//     "ui": {
//       "description": "A definition for a parent HTML element containing child nodes described by the elements property",
//       "$ref": "/ui",
//       "minItems": 1,
//     },
//     "elements": {
//       "description": "A definition for child HTML fragments describing user interface elements",
//       "$ref": "/elements"
//     }
//   },
//   "required": ["ui"],
//   "additionalProperties": false
// };
// 
// // TODO: The majority of UI elements will be described by this schema. Once we narrow down a set of UI elements (e.g. button, input, date, time)
// //       this schema should be expanded. There should be a set of explicitly defined UI elements (a la Web Components), as well as flexibility 
// //       to fall back to conventional HTML.
// schemata.ui = {
//   "$schema": "http://json-schema.org/draft-04/schema#",
//   "id": "/ui",
//   "title": "ui",
//   "description": "A schema for a user interface element mappable to an HTML fragment",
//   "type": "object",
//   "properties": {
//     "tag": "string"
//   },
//   "required": ["tag"]
// };
// 
// schemata.elements = {
//   "$schema": "http://json-schema.org/draft-04/schema#",
//   "id": "/elements",
//   "title": "elements",
//   "description": "A schema for a series of elements to be embedded in an HTML tag",
//   "type": "object",
//   "properties": {
//     "$ref": "/state",
//     "minItems": 1
//   }
// };

module.exports = schemata;