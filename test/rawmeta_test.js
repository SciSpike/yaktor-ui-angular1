'use strict';

var rawmeta = require('../lib/rawmeta')
  , raw = require('../example/raw') 
  , validator = require('jsonschema').Validator
  , path = require('path');

exports['rawmeta_test'] = {

  'create example is valid': function(test) {
    var v = new validator();
    var result = v.validate(raw, rawmeta);
    console.log(result);
    test.equal (result.errors.length, 0);
    test.done();
  }
};
