<% if (agents.length){%>
  angular.extend(this, $controller('<%- parentStateName%>AgentController', {$scope: $scope}));
<%}%>

          $scope.pagingOptions = {
            pageSize: 20, currentPage: 1, lastPage: 1, sort: {order: '', field: '', search: ''}
          };
          $scope.columnDefs = <%-parentStateName%>Services.columnDefs;
          $scope.actionButtons = [{
            state: 'POST',
            title: 'CREATE.NEW'
          }];
          $scope.grid = clientConstants.grid;
          $scope.gridActions = {
            changeState: function(state, entity) {
              index = $scope.gridOptions.getRowIdentity(entity);
              $scope.changeState(state, {
                id: index
              });
            },
            deleteItem: function(entity) {
              var id = $scope.gridOptions.getRowIdentity(entity);
              <%-parentStateName%>Services.delete<%-parentStateName%>({}, id).then(function(response) {
                for (var i = 0; i < $scope.gridOptions.data.length; i++) {
                  if ($scope.gridOptions.data[i]._id == id) {
                    $scope.gridOptions.data.splice(i, 1);
                    $scope.findData({});
                  }
                }
              });
            }
          };
          
<% if (agents.length){%>
        $scope.gridActions = $scope.MergeRecursive($scope.gridActions, $scope.gridAgentActions);
<%}%>          
          
          $scope.allData = -1;
          $scope.gridHeaders = <%-parentStateName%>Services.gridHeaders;
          $scope.gridOptions = {
            options: {
              actions: $scope.gridActions, columnDefs: $scope.columnDefs, enableExpandable: false, enableGridMenu: true, enableInfiniteScroll: true, infiniteScrollRowsFromEnd: 10, infiniteScrollUp: true, infiniteScrollDown: true,
              onRegisterApi: function(gridApi){
                gridApi.infiniteScroll.on.needLoadMoreData($scope, $scope.findData);
                gridApi.infiniteScroll.on.needLoadMoreDataTop($scope, $scope.findData);
                $scope.gridApi = gridApi;
              }
            }
          };
          $scope.gridOptions.getRowIdentity = function(entity) {
            if (entity.id){
              return entity.id;
            } else if (entity._id){
              return entity._id;
            } else {
              return null;
            }
           };
          $scope.findData = function(filters, reset){
            var data = angular.copy(filters) || {};
            if (reset){
              $scope.pagingOptions.currentPage = 1;
              $scope.gridOptions.data = [];
            }
            if($scope.pagingOptions.pageSize){
              data.pageSize = $scope.pagingOptions.pageSize;
            }
            <%-parentStateName %>Services.find<%-parentStateName%>(data, $scope.pagingOptions.currentPage)
              .then(function(response) {
                $scope.pagingOptions.totalServerItems = response.data.total;
                $scope.pagingOptions.totalPages = response.data.maxPage;
                $scope.pagingOptions.currentPage++;
                if($scope.allData == -1){
                  $scope.allData = response.data.total;
                }
                if($scope.pagingOptions.totalPages < $scope.pagingOptions.pageNav){
                  $scope.pagingOptions.pageNav = $scope.pagingOptions.totalPages;
                }
                if($scope.gridOptions.options.enableInfiniteScroll && $scope.gridApi && $scope.gridApi.infiniteScroll){
                  $scope.gridApi.infiniteScroll.saveScrollPercentage();
                  $scope.gridOptions.data = $scope.gridOptions.data.concat(response.data.results);
                  $scope.gridApi.infiniteScroll.dataLoaded(false, $scope.pagingOptions.currentPage <= $scope.pagingOptions.totalPages);
                }else{
                  $scope.gridOptions.data = response.data.results;
                }
                <% if (agents.length){%>
                  $scope.listInitAgents(response.data.results);
                <%}%>  
              })
              .catch(function(error){
                console.log(error);
              });
          };
          $scope.findData({});