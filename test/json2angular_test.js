'use strict';

var json2angular = require('../lib/json2angular.js');
var fs = require('fs');
var path = require('path');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports['json2angular_test'] = {
  setUp: function(done) {
    
    var schemaPath = path.join(__dirname, '..', 'example', 'soda.json');
    this.schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
    
    done();
  },
  
  'should create actionable element': function(test) {
    // TODO: Use ui element from JSON description
    
    test.done();
  },
  
  'should create actionable': function(test) {
    test.done();
  },
  
  'should create ui template': function(test) {
    var ui = this.schema.states[0].ui;
    
    var expectedTemplatePath = path.join(__dirname, 'template', 'button.html');
    var expectedTemplate = fs.readFileSync(expectedTemplatePath, 'utf8');
    test.equal(json2angular.createUITemplate(ui), expectedTemplate);
    test.done();
  },
  
  'should create state template': function(test) {
    var state = this.schema.states[0];
    
    var expectedTemplatePath = path.join(__dirname, 'template', 'state.html');
    var expectedTemplate = fs.readFileSync(expectedTemplatePath, 'utf8');
    
    test.equal(json2angular.createStateTemplate(state), expectedTemplate);
    test.done();
  },
  
};
