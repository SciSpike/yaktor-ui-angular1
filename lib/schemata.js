
var schemata = {
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
    },
    "layout": {
      "description": "Specify the layout of the generated application.",
      "enum": ["tabs"]
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

module.exports = schemata;