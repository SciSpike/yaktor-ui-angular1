angular.module('views')

.directive('uiGridDirective', function($eventsCommon, $timeout, clientConstants) {
  return {
    restrict: 'C',
    templateUrl: clientConstants.partialsBaseLocation + '/uiGrid/uiGrid.html',
    scope: {
      gridData: '=',
      gridOptions: '='
    },
    controller: function($scope) {
      $scope.myData = $scope.gridData;
      var colDefs, gridWidth;

      function makecolDefs(row) {
        colDefs = [];
        for ( var colName in row) {
          colDefs.push({ field: colName });
        }
        return colDefs;
      }

      function autoColWidth(colDefs, row, gridWidth) {
        var colWidth = gridWidth / colDefs.length;
        colDefs.forEach(function(colDef) {
          colDef.width = colWidth + 'px';
        });
        return colDefs;
      }

      var defaultOptions = {
        data: 'myData',
        enableInfiniteScroll: false,
        columnDefs: colDefs,
        enableCellNav: false,
        enableGridMenu: true,
        enableExporter: true
      };

      function MergeRecursive(obj1, obj2) {
        for (var p in obj2) {
          try {
            if ( obj2[p].constructor==Object ) {
              obj1[p] = MergeRecursive(obj1[p], obj2[p]);
            } else {
              obj1[p] = obj2[p];
            }
          } catch(e) {
            obj1[p] = obj2[p];
          }
        }
        return obj1;
      }

      $scope.gridOptions = MergeRecursive(defaultOptions, $scope.gridOptions);

      if ($scope.myData && $scope.myData.length && $scope.myData[0]) {
        colDefs = makecolDefs($scope.myData[0]);
        colDefs = autoColWidth(colDefs, $scope.myData[0], 0);
      }

      function setGridOptions(colDefs) {
        $scope.gridOptions = MergeRecursive(defaultOptions, $scope.gridOptions);
      }

      $scope.$watchCollection('gridData', function(newValue, oldValue) {
        $scope.myData = newValue;
        if ($scope.myData && $scope.myData.length && $scope.myData[0]) {
          colDefs = makecolDefs($scope.myData[0]);
          gridWidth = $('.ui-grid').width();
          if (gridWidth > 0 && $scope.myData.length) {
            colDefs = autoColWidth(colDefs, $scope.myData[0], gridWidth);
            setGridOptions(colDefs);
          }
        }
      });

      $scope.$watchCollection('gridOptions', function(newValue, oldValue) {
        $scope.gridOptions = newValue;
      });

      $scope.$onRootScope($eventsCommon.ngGrid.toggleWidth, function() {
        if ($scope.myData && $scope.myData.length && $scope.myData[0]) {
          colDefs = makecolDefs($scope.myData[0]);
        }

        $timeout(function() {
          gridWidth = $('.ui-grid').width();
          if (gridWidth > 0 && $scope.myData.length) {
            colDefs = autoColWidth(colDefs, $scope.myData[0], gridWidth);
            setGridOptions(colDefs);
          }
        });
      });
    }

  };
});
