angular.module('<%- parentStateName %>')
  .controller('<%- parentStateName %><%- moduleName %>Controller',
		  ['$rootScope','$scope','$state','$stateParams','$location', '<%- parentStateName %>Services', '$timeout',
		   function ($rootScope,$scope,$state,$stateParams,$location, <%- parentStateName %>Services, $timeout) {
			  
			  var id = $stateParams.id;
			  $scope.userId = id;
			  
			  <% if(state.ui.title.replace('_', '').toLowerCase() == 'get'){%>
			    $scope.actionButtons = [{
			        state: 'PUT',
			        title: 'EDIT'
			      }];
  			  function findData(data){
            <%- parentStateName %>Services.get<%- parentStateName%>({}, id).then(function(response) {
                  $scope.directiveData = response;
                 });
          }
          findData({});
          $scope.testType = function(value){
            if(typeof value == 'string'){
              return true;
            }
            return false;
          }
			  <% }%>
			  
			  <% if(state.ui.title.replace('_', '').toLowerCase() == 'find'){%>
  			  $scope.actionButtons = [{
            state: 'POST',
            title: 'CREATE.NEW'
          }];
  			  $scope.grid = true;
				  $scope.gridActions = {
						changeState: function(state, index){
							$scope.changeState(state,{id: index});
						},
						deleteItem: function(id){
						  var id = id;
						  <%- parentStateName %>Services.delete<%- parentStateName%>({}, id).then(function(response) {
						    for(var i=0; i<$scope.gridOptions.data.length; i++){
						      if($scope.gridOptions.data[i]._id == id){
						        $scope.gridOptions.data.splice(i, 1);
						        if($scope.filtersImplemented){
						          findData($scope.filtersImplemented);
						        }else{
						          findData({});
						        }
						      }
						    }
						  });
            }
				  };
				  function range(start, length){
					  var pageArray = [];
					  for(var i=0; i<length; i++){
						  pageArray.push(start);
						  start++;
					  }
					  return pageArray;
				  }
				  $scope.gotoPage = function(page) {
					  $scope.pagingOptions.currentPage = page;
					  if(page-2 <= 1){
						  page = 3;
					  }else if(page >= $scope.pagingOptions.totalPages){
						  page = $scope.pagingOptions.totalPages;
					  }
					  $scope.pagingOptions['pageButtons'] = range(page-2, $scope.pagingOptions.pageNav);
					  findData({});
				  };
				  $scope.pagingOptions = {
					  pageButtons: [1, 2, 3, 4, 5],
					  pageSize: 10,
					  currentPage: 1,
					  pageNav: 5,
					  totalPages: 5,
					  totalServerItems: 5
				  };
				  $scope.allData = -1;
				  $scope.gridHeaders = <%= JSON.stringify(state.components.elements)%>;
				  $scope.gridFilter = {};
				  $scope.numFilters = 0;
				  $scope.filterGrid = function(){
				    $scope.numFilters = 0;
				    $scope.filtersImplemented = angular.copy($scope.gridFilter);
				    for(item in $scope.filtersImplemented){
				      var itemType = $scope.filtersImplemented[item].constructor.name.toLowerCase();
				      if(itemType == 'array'){
				        var arrayEmpty = true;
				        for(var i=0; i<$scope.filtersImplemented[item].length; i++){
				          for(key in $scope.filtersImplemented[item][i]){
				            if($scope.gridFilter[item][i][key] != '' && $scope.gridFilter[item][i][key] != null){
				              arrayEmpty = false;
		                  $scope.numFilters++;
		                }else{
		                  delete $scope.gridFilter[item][i][key];
		                  delete $scope.filtersImplemented[item][i][key];
		                }
				          } 
				        }
				        if(arrayEmpty == true){
                  delete $scope.filtersImplemented[item];
				        }
				      }else{
				        if($scope.gridFilter[item] != '' && $scope.gridFilter[item] != null){
				          $scope.numFilters++;
				        }else{
				          delete $scope.gridFilter[item];
				          delete $scope.filtersImplemented[item];
				        }
				      }
				    }
				    findData($scope.filtersImplemented);
				  } 
				  $scope.removeFilter = function(child, parent, index){
				    if(parent){
				      delete $scope.gridFilter[parent][index][child];
				      delete $scope.filtersImplemented[parent][index][child];
				      $scope.numFilters--;
				    }else{
				      delete $scope.gridFilter[child];
				      delete $scope.filtersImplemented[child];
				      $scope.numFilters--;
				    }
				    findData($scope.filtersImplemented);
				  }
			    $scope.gridOptions = {
			        	options: {
				            enablePinning: true,
				            enableSorting: true,
				            enableColumnResize: true,
				            enableRowSelection: false,
				            actions: $scope.gridActions,
				            init:function(grid,$scope){
				              $scope.viewportStyle=function(){
				                return { };
				              }
				            },
				            columnDefs: [
				                         <%
				                         var elems = state.components.elements;
				                         Object.keys(elems).forEach(function(elem, index, test){
				                           var element=elems[elem];
				                         %>
				                         {
				                           field: '<%- elem%>',
				                           minWidth: 150,
				                           resizable: true,
				                           sortable: true,
				                           headerCellTemplate:"<div class='truncate'>{{'<%-element.ui.title%>'|translate}}</div>" +
				                              "<div class='ngSortButtonDown ng-hide' ng-show='col.showSortButtonDown()'></div>" +
				                              "<div class='ngSortButtonUp ng-hide' ng-show='col.showSortButtonUp()'></div>" +
				                           	  "<div ng-class='{ ngPinnedIcon: col.pinned, ngUnPinnedIcon: !col.pinned }' ng-click='togglePin(col)' ng-show='col.pinnable' class='ngPinnedIcon'></div>" +
				                           		"<div ng-show='col.resizable' class='ngHeaderGrip ng-scope' ng-click='col.gripClick($event)' ng-mousedown='col.gripOnMouseDown($event)'></div>"
				                         }, 
				                        <%});%>
				                        {
				                         <% var putState = 'main.' + parentStateName + '.PUT'; %>
					                       cellTemplate: "<div class='editCell'><a ng-click='gridOptions.actions.changeState(\"<%- putState%>\", row.getProperty(\"_id\"))'>{{'EDIT'|translate}}</a></div>",
					                       width: '75',
					                       minWidth: 75,
					                       resizable: false,
					                       headerCellTemplate:"<div>{{'EDIT'|translate}}</div>" 
					                     },
					                     {
                               <% var deleteState = 'main.' + parentStateName + '.DELETE'; %>
                               cellTemplate: "<div class='editCell'><button class='btn btn-default btn-sm' ng-click='confirmDelete = !confirmDelete' ng-show='!confirmDelete'>{{'DELETE'|translate}}</button><button class='btn btn-default btn-sm' ng-click='confirmDelete = !confirmDelete' ng-show='confirmDelete'>{{'CANCEL.DELETE'|translate}}</button>&nbsp;<button class='btn btn-default btn-sm' ng-click='gridOptions.actions.deleteItem(row.getProperty(\"_id\"))' ng-show='confirmDelete'>{{'CONFIRM.DELETE'|translate}}</button></div>",
                               width: '150',
                               minWidth: 150,
                               resizable: false,
                               headerCellTemplate:"<div>{{'DELETE'|translate}}</div>" 
                             }
				                        
				            ]
			        	}
			      }
			      function findData(data){
					  <%- parentStateName %>Services.find<%- parentStateName%>(data, $scope.pagingOptions.currentPage).then(function(response) {
			           	  	$scope.gridOptions.data = response.results;
			           	  	$scope.pagingOptions.totalServerItems = response.total;
			           	  	if($scope.allData == -1){
			           	  	 $scope.allData = response.total
			           	  	}
			           	  	$scope.pagingOptions.totalPages = Math.ceil($scope.pagingOptions.totalServerItems / $scope.pagingOptions.pageSize);
        							if($scope.pagingOptions.totalPages < $scope.pagingOptions.pageNav){
        								$scope.pagingOptions.pageNav = $scope.pagingOptions.totalPages;
        								$scope.pagingOptions.pageButtons = range($scope.pagingOptions.currentPage, $scope.pagingOptions.pageNav);
        							}
			           });
				  }
				  findData({});
			  <% }

			  if(state.ui.title.replace('_', '').toLowerCase() == 'post' || state.ui.title.replace('_', '').toLowerCase() == 'put'){
			    var directiveData = {};
			    var createDirectives = function(dataObject, elements){
			      for(element in elements){
			        if(elements[element].type == 'array'){
			          if(elements[element].components){
			            for(el in elements[element].components.elements){
			              elements[element].components.elements[el].answer = '';
			            }
			            dataObject[element] = [elements[element].components.elements];
			          }else{
			            dataObject[element] = elements[element];
			            dataObject[element].answer = new Array(1);
			          }
			        }else{
			          if(!elements[element].components){
                  dataObject[element] = elements[element];
                  dataObject[element].answer = '';
                }else{
                  dataObject[element] = {};
                  createDirectives(dataObject[element], elements[element].components.elements);
                }
			        }
			      }
			    }
				  createDirectives(directiveData, state.components.elements);%>
				  $scope.directiveData = <%= JSON.stringify(directiveData,null,2)%>;
				  <% if(state.ui.title.replace('_', '').toLowerCase() == 'put'){%>
					  	function mergeAnswers(dataObject, answersObject){
					  	  switch(dataObject.constructor.name.toLowerCase()) {
  	              case 'array':
  	                for(var i=0; i<dataObject.length; i++){
  	                  mergeAnswers(dataObject[i], answersObject[i]);
  	                }
  	                break;
  	            }
					  	  for(key in dataObject){
		              if(dataObject[key]){
		                if(dataObject[key].answer || dataObject[key].answer == ''){
		                  dataObject[key].answer = answersObject[key];
		                }else{
		                  mergeAnswers(dataObject[key], answersObject[key]);
		                }
		              }
		            }
					  	}
				  		<%- parentStateName %>Services.get<%- parentStateName%>({}, id).then(function(response) {
				  			mergeAnswers($scope.directiveData, response);
				  		});                 
				  <%}%>
				  var answers = {};
	        function returnAnswers(dataObject, answersObject){
	          switch(dataObject.constructor.name.toLowerCase()) {
              case 'array':
                for(var i=0; i<dataObject.length; i++){
                  answersObject[i] = {};
                  returnAnswers(dataObject[i], answersObject[i]);
                }
                break;
            }
	          for(key in dataObject){
	            if(dataObject[key]){
	              if(dataObject[key].answer || dataObject[key].answer == ''){
	                /*if(dataObject[key].typeRef){
	                  dataObject[key].answer = dataObject[key].answer._id;
	                }*/
                  answersObject[key] = dataObject[key].answer;
                }else{
                  switch(dataObject[key].constructor.name.toLowerCase()) {
                    case 'array':
                      answersObject[key] = [];
                      returnAnswers(dataObject[key], answersObject[key]);
                      break;
                    case 'object':
                      answersObject[key] = {};
                      returnAnswers(dataObject[key], answersObject[key]);
                      break;
                  }
                }
	            }
	          }
	          return answers;
	        }
				  $scope.submitForm = function(type){
					  var data = returnAnswers($scope.directiveData, answers);
					  <%- parentStateName %>Services.<%- state.ui.title.toLowerCase()%><%- parentStateName%>(data, id).then(function(response) {
			           	  	$scope.changeState('main.<%- parentStateName %>.FIND', {id: 1});
			            });
				  }
			  <%}%>
		  }]);