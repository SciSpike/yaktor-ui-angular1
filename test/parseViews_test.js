'use strict';

var fs = require('fs');
var path = require('path');
var parse = require('../lib/parse');
var prettyjson = require('prettyjson');

exports['parseView_test'] = {
  setUp: function(done) {
    this.views = require('../example/views.js');
    
    done();
  },
  
  'should parse views': function(test) {
    var model = parse.fromViews('Views', this.views);
    
    console.log( prettyjson.render(model) );
    test.done();
  },
  
  // 'should create an enum element': function(test) {
  //   var element = parse.createElement('currency', { type: 'string', enum: [ '$', '¥', '£', '€' ] });
  //   var model = { type: 'enum', ui: { options: [ '$', '¥', '£', '€' ] } };
  //   
  //   test.equal( JSON.stringify(element), JSON.stringify(model) );
  //   test.done();
  // },
  // 
  // 'should create a number element': function(test) {
  //   var element = parse.createElement('amount', { minimum: 0.01, type: 'number' });
  //   var model = { type: 'number', ui: { tag: "input", type: 'number', minimum: 0.01 } };
  //   
  //   test.equal( JSON.stringify(element), JSON.stringify(model) );
  //   test.done();
  // },
  // 
  // 'should create a string element': function(test) {
  //   var element = parse.createElement('machine', { '$typeRef': 'inventory.Machine', type: 'string' });
  //   var model = { type: 'string', ui: { tag: "input", type: 'text', '$typeRef': 'inventory.Machine' } };
  //   
  //   test.equal( JSON.stringify(element), JSON.stringify(model) );
  //   test.done();
  // }
  
  
};