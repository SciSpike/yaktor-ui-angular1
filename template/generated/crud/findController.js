          $scope.pagingOptions = {
            pageSize: 20, currentPage: 1, lastPage: 1, sort: {order: '', field: '', search: ''}
          };
          $scope.columnDefs = <%-parentStateName%>Services.columnDefs;
          $scope.actionButtons = [{
            state: 'POST',
            title: 'CREATE.NEW'
          }];
          $scope.grid = clientConstants.grid;
          $scope.gridActions = {<% _.each(agents, function(agent, index) {
              var agentName = agent.split('.').reverse().join("_of_");
              var newAgent = objectFindByKey(agentSpec, 'id', agent); %>
                get<%-newAgent.name%>ConversationState: function(entity) {
                  // console.log('<%- agent%> Get State For:' + id);
                  var id = $scope.gridOptions.getRowIdentity(entity);
                  var currentState = null;
                  if ($scope. <% -newAgent.name %> CurrentStates) {
                    currentState = $scope. <% -newAgent.name %> CurrentStates[id];
                  }
                  return currentState;
              },
              init<%-newAgent.name%>Conversation: function(entity) {
                // console.log('<%- agent%> INIT DATA:' + initData);
                var id = $scope.gridOptions.getRowIdentity(entity);

                var initData = {
                  _id: id
                }; <%-parentStateName%>Services.init<% -newAgent.name%>Conversation(initData);
              },
              <% _.each(newAgent.states, function(state, index) { %> <%
                var actions = _.toArray(state.elements); %> <% _.each(actions, function(action, i) { %>
                  do<%- agentName %>_<%- state.name %>_<%- action.name.toLowerCase()%> : function(entity) {
                    var id = $scope.gridOptions.getRowIdentity(entity);
                    var initData = {
                      _id: id
                    };
                    $rootScope.setFromCrud(true);
                    $state.go('main.<%- agentName %>.<%- state.name %>.<%- action.name%>', {
                      initData: id
                    });
                  },
                  <%
                }); %> <%
              }); %> <%
            }); %>
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
                <% _.each(agents, function(agent, index){
                  var agentName = agent.split('.').reverse().join("_of_");
                  var newAgent = objectFindByKey(agentSpec, 'id', agent);%>
                  for(i=0; i < response.data.results.length; i++){
                    var initData = {
                        _id: response.data.results[i]._id
                    };
                    $scope.init<%-newAgent.name%>Conversation(initData);
                  }
                  <%});%>
              })
              .catch(function(error){
                console.log(error);
              });
          };
          $scope.findData({});