angular.module('views')
	.directive('ngGridDirective', function($rootScope, $eventsCommon, $timeout) {
		return{
	          restrict: 'C',
              templateUrl : function($node, tattrs) {
                return partialsBaseLocation + "/ngGrid/ngGrid.html"
              },
	          scope: {
	        	  gridData: '='
	          },
	          controller: function($scope, $filter) {
	        	  $scope.gridLayoutPlugin = new ngGridLayoutPlugin();
	        	  $scope.gridOptions = {
	        		        data: 'myData',
	        		        enablePinning: true,
	        		        plugins: [$scope.gridLayoutPlugin],
	        		        columnDefs: columnDefs
	        		    };
	        		    $scope.myData = $scope.gridData();
	        		    
	        		    var columnDefs = [];
	        		    for (var property in $scope.myData[0]) {
	        		    	var column = {
	        		    			'width': 150
	        		    	}
		        		    column['field'] = property;
		        		    columnDefs.push(column);
	        		    }
	        		    columnDefs[columnDefs.length - 1].width = '*';
	        		    
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