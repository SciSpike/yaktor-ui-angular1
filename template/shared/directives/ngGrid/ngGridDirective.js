angular.module('<%=appname%>')
	.directive('ngGridDirective', function($rootScope, $eventsCommon, $timeout) {
		return{
	          restrict: 'C',
              templateUrl : function($node, tattrs) {
                return partialsBaseLocation + "/ngGrid/ngGrid.html"
              },
	          scope: {
	        	  gridData: '=',
                  gridOptions: '='
	          },
	          controller: function($scope, $filter) {

                $scope.myData = $scope.gridData;

                var columnDefs = [];
                for (var property in $scope.myData[0]) {
                  var column = {
                    'width': 150
                  }
                  column['field'] = property;
                  columnDefs.push(column);
                }
                columnDefs[columnDefs.length - 1].width = '*';

	        	$scope.gridLayoutPlugin = new ngGridLayoutPlugin();

	        	var defaultOptions = {
	        		        data: 'myData',
	        		        enablePinning: true,
	        		        plugins: [$scope.gridLayoutPlugin],
	        		        columnDefs: columnDefs
	        	};

                /* ########## Recursively merge properties of two objects ########## */
                function MergeRecursive(obj1, obj2) {
                  for (var p in obj2) {
                    try {
                      // Property in destination object set; update its value.
                      if ( obj2[p].constructor==Object ) {
                        obj1[p] = MergeRecursive(obj1[p], obj2[p]);
                      } else {
                        obj1[p] = obj2[p];
                      }
                    } catch(e) {
                      // Property in destination object not set; create it and set its value.
                      obj1[p] = obj2[p];
                    }
                  }
                  return obj1;
                }

                $scope.gridOptions = MergeRecursive(defaultOptions, $scope.gridOptions);
	        		    
	        	$scope.$onRootScope($eventsCommon.ngGrid.toggleWidth, function(){
	  	        	console.log('update grid layout');
	  	        	$timeout(function() {
			  	        $scope.gridLayoutPlugin.updateGridLayout();
			  	    }, 0);
	  	  		});
	          },
	          link: function(scope, attrs, element){

	          }
	      }
	});