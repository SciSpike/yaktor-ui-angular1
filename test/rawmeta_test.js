'use strict';

var rawmeta = require('../lib/allInOne-meta')
  , viewMeta = require('../lib/view-meta')
  , basemeta = require('../lib/base-meta')
  , raw = require('../example/allInOne') 
  , rawView = require('../example/views') 
  , validator = require('jsonschema').Validator
  , path = require('path');

exports['rawmeta_test'] = {

  'create example is valid': function(test) {
    var v = new validator();
    v.addSchema(basemeta,"/base-meta.js")
    v.addSchema(rawmeta,"/allInOne-meta.js")
    v.addSchema(viewMeta,"/view-meta.js")
    var result = v.validate(raw, "/allInOne-meta.js");
    console.log(result);
    test.equal (result.errors.length, 0);
    raw.SodaPurchase.purchaser.stateMatrix.hasMoney.spendMoney.type.properties.currency.type="stringy"
    var result = v.validate(raw, "/allInOne-meta.js");
    test.equal (result.errors.length, 1);
    

    var result = v.validate(rawView, "/view-meta.js");
    console.log(result);
    test.equal (result.errors.length, 0);
    
    test.done();
  }
};
