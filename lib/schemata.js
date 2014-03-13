
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
    "title": {
      "description": "The application's title",
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
    "host": {
      "description": "Specifies the host name of the server used to communicated over sockets and/or REST.",
      "type": "string"
    }
  },
  "required": ["name", "states"],
  "additionalProperties": false,
  
  "definitions": {
    
    "state": {
      "description": "A state containing a description of embedded UI components",
      "type": "object",
      "properties": {
        "title":{
          "type":["string","null","undefined"]
        },
        "friendly":{
          "type":["string","null","undefined"]
        },
        "url":{
          "type":["string","null","undefined"]
        },
        "proto":{
          "type":["string","null","undefined"]
        },
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
        "subPath":{
          "type":["string","null","undefined"]
        },
        "typeRefs": {
          "patternProperties": {
            ".*": {
              "type":"boolean"
            }
          }
        },
        "components" :{
          "properties":{
            "elements": {
              "patternProperties": {
                ".*": {
                  "$ref": "#/definitions/possiblyNestestActionable"
                }
              }
            },
            "actions": {
              "patternProperties": {
                ".*": {
                  "$ref": "#/definitions/actionable"
                }
              }
            }
          }
        }
      },
      "required": ["ui", "components"],
      "additionalProperties": false
    },
    
    "ui": {
      "description": "A description for a parent HTML element that contains child HTML fragments",
      "type": "object",
      "properties": {
        "title":{
          "type":"string"
        },
        "tag": {
          "enum": ["input","div", "section", "article"],
        }
      },
      "required":["title"],
      "additionalProperties": true
    },
    
    "possiblyNestestActionable": {
      "description": "",
      "type": "object",
      "oneOf":[
        {
          "properties": {
            "ui": {
              "$ref": "#/definitions/ui",
            },
            "type": {
              "enum": ["string", "number", "date", "integer", "enum", "toggle", "checkbox", "radio", "submit"]
            },
            "typeRef":{
              "type":"string"
            },
            "typeWrapper" :{
              "enum": ["array"],
              "required":false
            }
         },
         "required": ["ui", "type"]
        },{
          "properties": {
            "ui": {
              "$ref": "#/definitions/ui",
            },
            "components" :{
              "properties":{
                "elements": {
                  "patternProperties": {
                    ".*": {
                      "$ref": "#/definitions/possiblyNestestActionable"
                    }
                  }
                }
              }
            }
          },
          "required": ["components"]
        }
      ]
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