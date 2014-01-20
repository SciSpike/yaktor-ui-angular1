var schema = {};

schema = {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "primary meta source",
    "description": "the raw UI-free metadata",
    "type": "object",
    "patternProperties": {
        ".*": {
            "$ref": "#/definitions/conversation",
            "minItems": 1
        }
    },
    "additionalProperties": false,

    "definitions": {
        "conversation": {
            "description": "A top-level element",
            "type": "object",
            "patternProperties": {
                ".*": {
                    "$ref": "#/definitions/agent",
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
                    "$ref": "#/definitions/stateMatrix"
                }
            },
            "additionalProperties": true,
            "required": ["stateMatrix"]
        },
        "stateMatrix": {
            "description": "A container for states",
            "type": "object",
            "patternProperties": {
                ".*": {
                    "$ref": "base-meta.js#/definitions/viewSet"
                }
            }
        }
    }

};


module.exports = schema;