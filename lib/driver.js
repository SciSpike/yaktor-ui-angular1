
(function() {
  
  var fs = require('fs'),
      path = require('path'),
      walk = require('walk');
  
  var driver = {};
  
  driver.crawlForViews = function(dir) {
    var allViews = {};
    
    var options = {
      listeners: {
        directories: function (root, dirStatsArray, next) {
          next();
        },
        file: function (root, fileStats, next) {
          if (fileStats.name === "views.js") {
            var views = require(path.join(root, fileStats.name));
            
            for (var name in views) {
              allViews[name] = views[name];
            }
          }
          
          next();
        },
        errors: function (root, nodeStatsArray, next) {
          next();
        }
      }
    };
    var walker = walk.walkSync(dir, options);
    
    return allViews;
  }
  
  module.exports = driver;
}());