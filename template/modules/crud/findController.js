$scope.pagingOptions = {
  pageSize: 20,
  currentPage: 1,
  lastPage: 1,
  sort: {
    order: '',
    field: '',
    search: ''
  }
};

$scope.columnDefs = [ <%
      var elems = state.components.elements;
      Object.keys(elems).forEach(function(elem, index, test) {
        var element = elems[elem]; %> { <%
          if (element.type == "typeAhead" || element.type == "select") { %> <%
            if (element.ui.hasTitle) { %>
                field: '<%- element.ui.title%>.title',
              <%
            } else { %>
                field: '<%- element.ui.title%>',
              <%
            } %> <%
          } else if (element.type.toLowerCase() == "date"){ %>
              field: '<%- elem%>',
              type: Date,
              cellFilter: "date : 'MMM d, y'",
            <% 
          } else { %>
              field: '<%- elem%>',
         <% } %>
          minWidth: 150,
          enableColumnResizing: true,
          enableHiding: false,
          enableSorting: true,
          displayName: $filter('translate')('<%-element.ui.title%>')
        }, <%
      }); %> <%
      if (agents.length > 0 && (state.ui.title.replace('_', '').toLowerCase() == 'find')) {
        //used for extracting objects from the spec
        var objectFindByKey = function(array, key, value) {
          for (var i = 0; i < array.length; i++) {
            if (array[i][key] == value) {
              return array[i];
            }
          }
          return null;
        } %> <% _.each(agents, function(agent, index) {
          var agentName = agent.split('.').reverse().join("_of_");
          var newAgent = objectFindByKey(agentSpec, 'id', agent); %> {
            cellTemplate: "<div>{{grid.appScope.gridOptions.actions.get<%- newAgent.name%>ConversationState(row.entity);}}</div>",
            minWidth: 150,
            enableColumnResizing: true,
            enableHiding: false,
            enableSorting: false,
            displayName: $filter('translate')('STATE'),
            name: 'agent-state'
          }, {
            cellTemplate: "<div>" + "<button class='btn btn-default btn-sm text-capitalize' ng-if='gridOptions.actions.get<%- newAgent.name%>ConversationState(row.entity)==null' ng-click='grid.appScope.gridOptions.actions.init<%- newAgent.name%>Conversation(row.entity);' >{{'INIT'|translate}}</button>" + <% _.each(newAgent.states, function(state, index) { %> <%
              var actions = _.toArray(state.elements); %> <% _.each(actions, function(action, i) { %>
                  "<button class='btn btn-default btn-sm text-capitalize' ng-if='grid.appScope.gridOptions.actions.get<%- newAgent.name%>ConversationState(row.entity)==\"<%-state.name%>\"' ng-click='grid.appScope.gridOptions.actions.do<%- agentName%>_<%- state.name %>_<%- action.name.toLowerCase()%>(row.entity);' ><%- action.name%></button>" + <%
              }); %> <%
            }); %>
              "</div>",
            minWidth: 150,
            enableColumnResizing: true,
            enableHiding: false,
            enableSorting: false,
            displayName: $filter('translate')('ACTIONS'),
            name: 'agent-actions'
          }, <%
        }); %> <%
      } %> { <%
        var putState = 'main.' + parentStateName + '.PUT'; %>
          cellTemplate: "<div class='editCell '><a ng-click='grid.appScope.gridOptions.actions.changeState(\"<%- putState%>\", row.entity)'>{{'EDIT'|translate}}</a></div>",
        width: '75',
        minWidth: 75,
        enableColumnResizing: true,
        enableHiding: false,
        enableSorting: false,
        displayName: $filter('translate')('EDIT'),
        name: 'edit'
      }, { <%
        var deleteState = 'main.' + parentStateName + '.DELETE'; %>
          cellTemplate: "<div class='editCell'><button class='btn btn-default btn-sm' ng-click='confirmDelete = !confirmDelete' ng-show='!confirmDelete'>{{'DELETE'|translate}}</button><button class='btn btn-default btn-sm' ng-click='confirmDelete = !confirmDelete' ng-show='confirmDelete'>{{'CANCEL.DELETE'|translate}}</button>&nbsp;<button class='btn btn-default btn-sm' ng-click='grid.appScope.gridOptions.actions.deleteItem(row.entity)' ng-show='confirmDelete'>{{'CONFIRM.DELETE'|translate}}</button></div>",
        width: '150',
        minWidth: 150,
        enableColumnResizing: false,
        enableHiding: false,
        enableSorting: false,
        displayName: $filter('translate')('DELETE'),
        name: 'delete'
      }
    ];
    
$scope.search = {
  field: ''
};

$scope.actionButtons = [{
  state: 'POST',
  title: 'CREATE.NEW'
}];
$scope.grid = clientConstants.grid;
$scope.gridActions = {

  //AGENT BUTTONS ACTIONS
  <% _.each(agents, function(agent, index) {
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
          if ($scope.filtersImplemented) {
            $scope.findData($scope.filtersImplemented);
          } else {
            $scope.findData({});
          }
        }
      }
    });
  }
};

function range(start, length) {
  var pageArray = [];
  for (var i = 0; i < length; i++) {
    pageArray.push(start);
    start++;
  }
  return pageArray;
};
$scope.gotoPage = function(page) {
  $scope.pagingOptions.currentPage = page;
  if (page - 2 <= 1) {
    page = 3;
  } else if (page >= $scope.pagingOptions.totalPages) {
    page = $scope.pagingOptions.totalPages;
  }
  $scope.pagingOptions['pageButtons'] = range(page - 2, $scope.pagingOptions.pageNav);
  $scope.findData({});
};

$scope.allData = -1;
$scope.gridHeaders = <%= JSON.stringify(state.components.elements) %> ;
$scope.gridFilter = {};

$scope.filterGrid = function() {
  $scope.grid.numFilters = 0;
  $scope.filtersImplemented = angular.copy($scope.gridFilter);
  for (item in $scope.filtersImplemented) {
    var itemType = $scope.filtersImplemented[item].constructor.name.toLowerCase();
    if (itemType == 'array') {
      var arrayEmpty = true;
      for (var i = 0; i < $scope.filtersImplemented[item].length; i++) {
        for (key in $scope.filtersImplemented[item][i]) {
          if ($scope.gridFilter[item][i][key] != '' && $scope.gridFilter[item][i][key] != null) {
            arrayEmpty = false;
            $scope.grid.numFilters++;
          } else {
            delete $scope.gridFilter[item][i][key];
            delete $scope.filtersImplemented[item][i][key];
          }
        }
      }
      if (arrayEmpty == true) {
        delete $scope.filtersImplemented[item];
      }
    } else {
      if ($scope.gridFilter[item] != '' && $scope.gridFilter[item] != null) {
        $scope.grid.numFilters++;
      } else {
        delete $scope.gridFilter[item];
        delete $scope.filtersImplemented[item];
      }
    }
  }
  $scope.findData($scope.filtersImplemented, true);
};
$scope.removeFilter = function(child, parent, index) {
  if (parent) {
    delete $scope.gridFilter[parent][index][child];
    delete $scope.filtersImplemented[parent][index][child];
    $scope.grid.numFilters--;
  } else {
    delete $scope.gridFilter[child];
    delete $scope.filtersImplemented[child];
    $scope.grid.numFilters--;
  }
  $scope.findData($scope.filtersImplemented, true);
};
$scope.gridOptions = {
  options: {
    actions: $scope.gridActions,
    columnDefs: $scope.columnDefs,
    enableExpandable: false,
    enableInfiniteScroll: true,
    infiniteScrollRowsFromEnd: 10,
    infiniteScrollUp: true,
    infiniteScrollDown: true,
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
	<%-parentStateName %>Services.find<%-parentStateName%>(data, $scope.pagingOptions.currentPage).then(function(response) {
		$scope.pagingOptions.totalServerItems = response.total;
		$scope.pagingOptions.currentPage++;
    if($scope.allData == -1){
			$scope.allData = response.total;
		}
		$scope.pagingOptions.totalPages = response.maxPage;
		if($scope.pagingOptions.totalPages < $scope.pagingOptions.pageNav){
			$scope.pagingOptions.pageNav = $scope.pagingOptions.totalPages;
		}
    
    if($scope.gridOptions.options.enableInfiniteScroll && $scope.gridApi && $scope.gridApi.infiniteScroll){
      $scope.gridApi.infiniteScroll.saveScrollPercentage();
      
  		$scope.gridOptions.data = $scope.gridOptions.data.concat(response.results);
      $scope.gridApi.infiniteScroll.dataLoaded(false, $scope.pagingOptions.currentPage <= $scope.pagingOptions.totalPages);
    }else{
  		$scope.gridOptions.data = response.results;
    }


		//Init agents for each row
		<% _.each(agents, function(agent, index){
			var agentName = agent.split('.').reverse().join("_of_");
			var newAgent = objectFindByKey(agentSpec, 'id', agent);%>
			for(i=0; i < response.results.length; i++){
				var initData = {
						_id: response.results[i]._id
				};
				$scope.init<%-newAgent.name%>Conversation(initData);
			}
			<%});%>
	});
};
$scope.findData({});
