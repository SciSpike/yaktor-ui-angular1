
var schema = {};

schema= {
  "$schema": "http://json-schema.org/draft-04/schema#",
  "title": "primary meta source",
  "description": "the raw UI-free metadata",
  "type": "object",
  "patternProperties": {
    ".*":  {
      "$ref":"#/definitions/conversation",
      "minItems": 1
    }
  },
  "additionalProperties": false,
  
  "definitions": {
    "conversation": {
      "description": "A top-level element",
      "type": "object",
      "patternProperties": {
        ".*":  {
          "$ref":"#/definitions/agent",
          "minItems": 1
        }
      },
      "additionalProperties": false
    },
    "agent": {
      "description": "A second level element",
      "type": "object",
      "properties": {
        "stateMatrix": {
          "$ref":"#/definitions/stateMatrix"
        }
      },
      "additionalProperties": true,
      "required": ["stateMatrix"]
    },
    "stateMatrix":{
      "description":"A container for states",
      "type": "object",
      "patternProperties": {
        ".*":  {
          "$ref":"#/definitions/state"
        }
      }
    },
    "stringType":{
      "type": "object",
      "title": "stringType",
      "description": "stringType",
      "properties":{
        "$typeRef":{
          "type":"string"
        },
        "type":{
          "type":"string",
          "enum":["string"],
        },
        "pattern":{
          "type":"string"
        },
        "enum":{
          "type":"array"
        }
      },
      "required":["type"],
      "additionalProperties": false
    },
    "numberType":{
      "type": "object",
      "title": "numberType",
      "description": "numberType",
      "properties":{
        "$typeRef":{
          "type":"string"
        },
        "type":{
          "type":"string",
          "enum":["number"],
        },
        "minimum":{
          "type":["number"]
        },
        "maximum":{
          "type":["number"]
        }
      },
      "required":["type"],
      "additionalProperties": false
    },
    "dateType":{
      "type": "object",
      "title": "dateType",
      "description": "dateType",
      "properties":{
        "type":{
          "type":"string",
          "enum":["date"],
        },
        "minimum":{
          "type":["string"]
        },
        "maximum":{
          "type":["string"]
        }
      },
      "required":["type"],
      "additionalProperties": false
    },
    "integerType":{
      "type": "object",
      "title": "integerType",
      "description": "integerType",
      "properties":{
        "$typeRef":{
          "type":"string"
        },
        "type":{
          "type":"string",
          "enum":["integer"],
        },
        "minimum":{
          "type":["number"]
        },
        "maximum":{
          "type":["number"]
        }
      },
      "required":["type"],
      "additionalProperties": false
    },
    "properties":{
      "patternProperties": {
        ".*":  {
          "oneOf":[
            {"$ref":"#/definitions/stringType"},
            {"$ref":"#/definitions/numberType"},
            {"$ref":"#/definitions/dateType"},
            {"$ref":"#/definitions/integerType"}
          ]
        }
      },
    },
    "event": {
      "type": "object",
      "properties":{
        "type":{
          "$ref":"#/definitions/type"
        }
      }
      
    },
    "type":{
      "type":"object",
      "properties": {
        "properties":  {
          "$ref":"#/definitions/properties",
          "minItems": 1
        }
      },
      "uniqueItems": true,
      "additionalProperties": false,
    },
    "state": {
      "description": "A schema for a series of elements to be embedded in an HTML tag",
      "type": "object",
      "patternProperties": {
        ".*":  {
          "$ref":"#/definitions/event",
          "minItems": 1
        }
      },
      "uniqueItems": true,
      "additionalProperties": false,
    }
  }
  
};


module.exports = schema;