(function() {
  
  var appSchema = {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "id": "/application",
    "title": "application",
    "description": "An schema for a web application",
    "type": "object",
    "properties": {
      "name": {
        "description": "The application name"
        "type": "string"
      },
      "states": {
        "description": "A collection of state objects",
        "type": "object",
        "minItems": 1,
        "uniqueItems": true
      }
    },
    "required": ["name", "states"]
  }
  
  module.exports = schema;
}());