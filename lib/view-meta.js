var schema = {};

schema = {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "primary meta source for views",
    "description": "the raw UI-free metadata",
    "type": "object",
    "patternProperties": {
        ".*": {
            "$ref": "base-meta.js#/definitions/viewSet",
            "minItems": 1
        }
    },
    "additionalProperties": false
};


module.exports = schema;