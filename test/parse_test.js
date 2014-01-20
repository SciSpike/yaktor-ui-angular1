'use strict';

var fs = require('fs');
var path = require('path');
var parse = require('../lib/parse');
var prettyjson = require('prettyjson');

exports['parse_test'] = {
  setUp: function(done) {
      
    var f = require('../example/allInOne.js');
    this.stateMatrix = f.SodaPurchase.purchaser.stateMatrix;
    
    done();
  },
  
  'should parse state matrix': function(test) {
    var model = parse.fromStateMatrix('SodaPurchaser', this.stateMatrix);
    
    console.log( prettyjson.render(model) );
    test.done();
  }
  
};