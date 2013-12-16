
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
      "description": "A collection of state objects",
      "patternProperties": {
        ".*":  {
          "$ref":"#/definitions/element",
          "minItems": 1
        }
      },
      "minItems": 1,
      "uniqueItems": true
    }
  },
  "required": ["name", "states"],
  "additionalProperties": false,
  
  "definitions": {
    "element": {
      "description": "A schema for an application state",
      "type": "object",
      "properties": {
        "ui": {
          "description": "A definition for a parent HTML element containing child nodes described by the elements property",
          "$ref": "#/definitions/ui",
          "minItems": 1,
        },
        "elements": {
          "description": "A definition for child HTML fragments describing user interface elements",
          "$ref": "#/definitions/elements"
        },
        "type":{
          "enum":["string","number","date","integer"],
          "default": "string"
        },
        "minimum":{
          "type":["string","number"]
        },
        "maximum":{
          "type":["string","number"]
        }
      },
      "required": ["ui"],
      "additionalProperties": false
    },
    "ui": {
      "description": "A schema for a user interface element mappable to an HTML fragment",
      "type": "object",
      "properties": {
        "tag": {
          "type":"string"
        }
      },
      "additionalProperties": true,
      "required": ["tag"]
    },
    "elements": {
      "description": "A schema for a series of elements to be embedded in an HTML tag",
      "patternProperties": {
        ".*":  {
          "$ref":"#/definitions/element",
          "minItems": 1
        }
      },
      "uniqueItems": true,
      "additionalProperties": false,
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