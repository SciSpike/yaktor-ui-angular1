'use strict';

var json2angular = require('../lib/json2angular.js');
var fs = require('fs');
var path = require('path');
var S = require('string');
var beautify = require('js-beautify').html;

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
    done();
  },
  
  'should create toggle ui': function(test) {
    var description = {
      "type": "toggle",
      "ui": {
        "tag": "button",
      }
    };
    var stateName = new S("hasMoney");
    var elementName = "toggleExample";
    
    var fragment = json2angular.createActionableElement(stateName, elementName, description.type, description.ui);
    
    var controlFragment = "<button class='btn btn-default btn-sm ' ng-model='data.hasMoney.toggleExample' type='button' btn-checkbox btn-checkbox-true='0' btn-checkbox-false='1'>Has money</button>";
    test.equal(beautify(controlFragment), beautify(fragment));
    
    test.done();
  },
  
  'should create checkbox ui': function(test) {
    var description = {
      "type": "checkbox",
      "ui": {
        "options": ["option1", "option2", "option3"]
      }
    };
    var stateName = new S("hasMoney");
    var elementName = "checkboxExample";
    
    var fragment = json2angular.createActionableElement(stateName, elementName, description.type, description.ui);
    
    var controlFragment = "<div class='btn-group'><button class='btn btn-default btn-sm ' ng-model='data.hasMoney.checkboxExample[option]' type='button' btn-checkbox ng-repeat='option in [\"option1\", \"option2\", \"option3\"] track by $index'>{{option}}</button></div>";

    test.equal(beautify(controlFragment), beautify(fragment));
    test.done();
  },
  
  'should create radio ui': function(test) {
    var description = {
      "type": "radio",
      "ui": {
        "options": ["option1", "option2", "option3"]
      }
    };
    var stateName = new S("hasMoney");
    var elementName = "radioExample";
    
    var fragment = json2angular.createActionableElement(stateName, elementName, description.type, description.ui);
    
    var controlFragment = "<div class='btn-group'><button class='btn btn-default btn-sm ' ng-model='data.hasMoney.radioExample' type='button' btn-radio='option' ng-repeat='option in [\"option1\", \"option2\", \"option3\"] track by $index'>{{option}}</button></div>";
    
    test.equal(beautify(controlFragment), beautify(fragment));
    
    test.done();
  }
  
  // 'should create state template': function(test) {
  //   var state = this.schema.states[0];
  //   
  //   var expectedTemplatePath = path.join(__dirname, 'template', 'state.html');
  //   var expectedTemplate = fs.readFileSync(expectedTemplatePath, 'utf8');
  //   
  //   test.equal(json2angular.createStateTemplate(state), expectedTemplate);
  //   test.done();
  // },
  
};
