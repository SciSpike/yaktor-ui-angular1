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
  },
  
  'should create enum ui': function(test) {
    var description = {
      "type": "enum",
      "ui": {
        "options": ["option1", "option2", "option3"]
      }
    };
    var stateName = new S("hasMoney");
    var elementName = "enumExample";
    
    var fragment = json2angular.createActionableElement(stateName, elementName, description.type, description.ui);
    var controlFragment = "<select class='form-control input-sm' ng-model='data.hasMoney.enumExample' ng-options='option for option in [\"option1\", \"option2\", \"option3\"]'></select>";
    
    test.equal(beautify(controlFragment), beautify(fragment));
    test.done();
  },
  
  'should create date ui': function(test) {
    var description = {
      "type": "date",
      "ui": {}
    }
    var stateName = new S("hasMoney");
    var elementName = "dateExample";
    
    var fragment = json2angular.createActionableElement(stateName, elementName, description.type, description.ui);
    var controlFragment = "<p class='input-group'><input type='text' class='form-control input-sm ' ng-model='data.hasMoney.dateExample' datepicker-popup='dd-MMMM-yyyy' show-weeks='false' show-button-bar='false'></input><span class='input-group-btn'><button class='btn btn-default btn-sm'><i class='glyphicon glyphicon-calendar'></i></button></span></p>";
    
    test.equal(beautify(controlFragment), beautify(fragment));
    test.done();
  },
  
  'should create submit ui': function(test) {
    var description = {
      "type": "submit",
      "ui": {
        title: "Submit"
      }
    }
    var stateName = new S("hasMoney");
    var elementName = "submitExample";
    
    var fragment = json2angular.createActionableElement(stateName, elementName, description.type, description.ui);
    var controlFragment = "<button title='Submit' class='btn btn-default btn-sm ' type='button'>Has money</button>";
    
    test.equal(beautify(controlFragment), beautify(fragment));
    test.done();
  }
  
};
