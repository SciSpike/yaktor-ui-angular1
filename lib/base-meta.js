var schema = {};

schema = {
  "$schema" : "http://json-schema.org/draft-04/schema#",
  "title" : "primary meta source",
  "description" : "the raw UI-free metadata",
  "type" : "object",
  "patternProperties" : {
    ".*" : {
      "$ref" : "#/definitions/viewSet",
      "minItems" : 1
    }
  },
  "additionalProperties" : false,
  "definitions" : {
    "stringType" : {
      "type" : "object",
      "title" : "stringType",
      "description" : "stringType",
      "properties" : {
        "$typeRef" : {
          "type" : "string"
        },
        "type" : {
          "type" : "string",
          "enum" : [ "string" ],
        },
        "obscured":{
          "type":"boolean"
        },
        "pattern" : {
          "type" : "string"
        },
        "enum" : {
          "type" : "array"
        }
      },
      "required" : [ "type" ],
      "additionalProperties" : false
    },
    "numberType" : {
      "type" : "object",
      "title" : "numberType",
      "description" : "numberType",
      "properties" : {
        "$typeRef" : {
          "type" : "string"
        },
        "type" : {
          "type" : "string",
          "enum" : [ "number" ],
        },
        "minimum" : {
          "type" : [ "number" ]
        },
        "maximum" : {
          "type" : [ "number" ]
        }
      },
      "required" : [ "type" ],
      "additionalProperties" : false
    },
    "dateType" : {
      "type" : "object",
      "title" : "dateType",
      "description" : "dateType",
      "properties" : {
        "type" : {
          "type" : "string",
          "enum" : [ "date" ],
        },
        "minimum" : {
          "type" : [ "string" ]
        },
        "maximum" : {
          "type" : [ "string" ]
        }
      },
      "required" : [ "type" ],
      "additionalProperties" : false
    },
    "integerType" : {
      "type" : "object",
      "title" : "integerType",
      "description" : "integerType",
      "properties" : {
        "$typeRef" : {
          "type" : "string"
        },
        "type" : {
          "type" : "string",
          "enum" : [ "integer" ],
        },
        "minimum" : {
          "type" : [ "number" ]
        },
        "maximum" : {
          "type" : [ "number" ]
        }
      },
      "required" : [ "type" ],
      "additionalProperties" : false
    },
    "arrayType" : {
      "type" : "object",
      "title" : "arrayType",
      "description" : "arrayType",
      "properties" : {
        "type" : {
          "type" : "string",
          "enum" : [ "array" ],
        },
        "items" : {
          "oneOf" : [ {
            "$ref" : "#/definitions/type",
            "minItems" : 1
          }, {
            "$typeRef" : {
              "type" : "string"
            },
            "type" : {
              "properties" : {
                "type" : {
                  "type" : "string",
                  "enum" : [ "string", "integer", "number", "date" ],
                }
              }
            }
          } ]
        }
      },
      "required" : [ "type", "items" ],
      "additionalProperties" : false
    },
    "properties" : {
      "patternProperties" : {
        ".*" : {
          "oneOf" : [ {
            "toString" : function() {
              return "stringType"
            },
            "$ref" : "#/definitions/stringType"
          }, {
            "toString" : function() {
              return "numberType"
            },
            "$ref" : "#/definitions/numberType"
          }, {
            "toString" : function() {
              return "dateType"
            },
            "$ref" : "#/definitions/dateType"
          }, {
            "toString" : function() {
              return "integerType"
            },
            "$ref" : "#/definitions/integerType"
          }, {
            "toString" : function() {
              return "arrayType"
            },
            "$ref" : "#/definitions/arrayType"
          }, {
            "toString" : function() {
              return "type"
            },
            "$ref" : "#/definitions/type"
          } ]
        }
      },
    },
    "action" : {
      "description" : "Contains a type which can be acted upon",
      "type" : "object",
      "properties" : {
        "endpoint":{
          "type":"string"
        }
        "type" : {
          "$ref" : "#/definitions/type"
        }
      }

    },
    "type" : {
      "type" : "object",
      "properties" : {
        "properties" : {
          "$ref" : "#/definitions/properties",
          "minItems" : 1
        }
      },
      "uniqueItems" : true,
      "additionalProperties" : false,
    },
    "viewSet" : {
      "description" : "Contains a set of action(s), of which one will be chosen and then acted upon",
      "type" : "object",
      "patternProperties" : {
        ".*" : {
          "$ref" : "#/definitions/action",
          "minItems" : 1
        }
      },
      "uniqueItems" : true,
      "additionalProperties" : false,
    }
  }

};

module.exports = schema;