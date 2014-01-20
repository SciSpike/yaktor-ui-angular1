'use strict';

var fs = require('fs');
var path = require('path');


exports['parse_test'] = {
  setUp: function(done) {
      
    var f = require('../example/raw.js');
    this.stateMatrix = f.SodaPurchase.purchaser.stateMatrix;
    
    done();
  },
  
  'should parse state matrix': function(test) {
    console.log(this.stateMatrix);
    test.done();
  }
  
};