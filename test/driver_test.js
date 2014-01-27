'use strict';

var fs = require('fs');
var path = require('path');
var driver = require('../lib/driver');
var prettyjson = require('prettyjson');

exports['driver_test'] = {
  setUp: function(done) {
    done();
  },
  
  'should crawl a SciSpike application for views': function(test) {
    
    var directory = '/Users/amit/Documents/workspace/Test/public'
    driver.crawlForViews(directory);
    
    // console.log( prettyjson.render(model) );
    test.done();
  }
  
};