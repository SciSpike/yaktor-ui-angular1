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
  
  'spec should not validate due to missing name': function(test) {
    var spec = {
      "states": {}
    };
    
    var valid = tv4.validate(spec, schemata.app);
    test.equal(tv4.errorCodes["OBJECT_REQUIRED"], tv4.error.code);
    
    test.done();
  },
  
  'spec should not validate due to missing states': function(test) {
    var spec = {
      "name": "Soda Purchaser"
    };
    
    var valid = tv4.validate(spec, schemata.app);
    test.equal(tv4.errorCodes["OBJECT_REQUIRED"], tv4.error.code);
    test.done();
  },
  
  'spec should not have additional properties': function(test) {
    var spec = {
      "name": "Soda Purchaser",
      "states": {},
      "someExtraDefinition": {}
    };
    
    var valid = tv4.validate(spec, schemata.app);
    test.equal(tv4.errorCodes["OBJECT_ADDITIONAL_PROPERTIES"], tv4.error.code);
    test.done();
  },
  
};