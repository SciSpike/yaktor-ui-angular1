'use strict';

var fs = require('fs');
var path = require('path');
var schemata = require('../lib/schemata.js');
var tv4 = require('tv4');

exports['schemaValidation_test'] = {
  setUp: function(done) {
    
    var schemaPath = path.join(__dirname, '..', 'example', 'soda.json');
    this.schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
    
    done();
  },
  
  'spec should not validate due to missing `name` property': function(test) {
    var spec = {
      "states": {}
    };
    
    var valid = tv4.validate(spec, schemata);
    test.equal(tv4.errorCodes["OBJECT_REQUIRED"], tv4.error.code);
    
    test.done();
  },
  
  'spec `name` should be a string': function(test) {
    var spec = {
      "name": 5,
      "states": {}
    };
    
    var valid = tv4.validate(spec, schemata);
    test.equal(tv4.errorCodes["INVALID_TYPE"], tv4.error.code);
    test.done();
  },
  
  'spec should not validate due to missing `states` property': function(test) {
    var spec = {
      "name": "Soda Purchaser"
    };
    
    var valid = tv4.validate(spec, schemata);
    test.equal(tv4.errorCodes["OBJECT_REQUIRED"], tv4.error.code);
    test.done();
  },
  
  'spec should not have additional properties beyond `name` and `states`': function(test) {
    var spec = {
      "name": "Soda Purchaser",
      "states": {},
      "someExtraDefinition": {}
    };
    
    var valid = tv4.validate(spec, schemata);
    test.equal(tv4.errorCodes["OBJECT_ADDITIONAL_PROPERTIES"], tv4.error.code);
    test.done();
  },
  
  'state should contain an `elements` key': function(test) {
    var spec = {
      "name": "Soda Purchaser",
      "states": {
        "exampleState1": {}
      }
    };
    
    var valid = tv4.validate(spec, schemata);
    test.equal(tv4.errorCodes["OBJECT_REQUIRED"], tv4.error.code);
    test.done();
  },
  
  'state element should contain a `ui` and `elements` keys': function (test) {
    var spec = {
      "name": "Soda Purchaser",
      "states": {
        "exampleState1": {
          "elements": {
            "exampleElement1": {}
          }
        }
      }
    };
    
    // Should fail validation for absence of `ui` property
    var valid = tv4.validate(spec, schemata);
    test.equal(tv4.errorCodes["OBJECT_REQUIRED"], tv4.error.code);
    
    // Append `ui` property and required `ui.tag`
    spec.states.exampleState1.elements.exampleElement1.ui = {};
    spec.states.exampleState1.elements.exampleElement1.ui.tag = "div";
    
    // Should fail validation for absence of `elements` property
    valid = tv4.validate(spec, schemata);
    test.equal(tv4.errorCodes["OBJECT_REQUIRED"], tv4.error.code);
    
    // Append `elements` property
    spec.states.exampleState1.elements.exampleElement1.elements = {};
    
    // Now schema should validate
    valid = tv4.validate(spec, schemata);
    test.equal(valid, true);
    
    test.done();
  },
  
  'an actionable should have a `ui` property': function (test) {
    var spec = {
      "name": "Soda Purchaser",
      "states": {
        "exampleState1": {
          "elements": {
            "exampleElement1": {
              "ui": {
                "tag": "div"
              },
              "elements": {
                "exampleActionable": {}
              }
            }
          }
        }
      }
    };
    
    // Should fail validation for absence of `ui` property
    var valid = tv4.validate(spec, schemata);
    test.equal(tv4.errorCodes["OBJECT_REQUIRED"], tv4.error.code);
    
    // Adding a `ui` property
    spec.states.exampleState1.elements.exampleElement1.elements.exampleActionable.ui = {};
    valid = tv4.validate(spec, schemata);
    test.equal(tv4.errorCodes["OBJECT_REQUIRED"], tv4.error.code);
    
    // Adding a `type` property
    spec.states.exampleState1.elements.exampleElement1.elements.exampleActionable.type = "";
    valid = tv4.validate(spec, schemata);
    test.equal(tv4.errorCodes["ENUM_MISMATCH"], tv4.error.code);
    
    // Using correct value for `type` property
    spec.states.exampleState1.elements.exampleElement1.elements.exampleActionable.type = "enum";
    valid = tv4.validate(spec, schemata);
    test.equal(valid, true);
    
    test.done();
  },
  
  
};