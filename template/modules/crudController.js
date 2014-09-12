angular.module('<%- parentStateName %>')
  .controller('<%- parentStateName %><%- moduleName %>Controller',
		  ['$rootScope','$scope','$state','$stateParams','$location', '<%- parentStateName %>Services',
		   function ($rootScope,$scope,$state,$stateParams,$location, <%- parentStateName %>Services) {
			  
			  var id = $stateParams.id;
			  
			  <% if(state.ui.title.toLowerCase() == '_find'){%>
			  		
				  $scope.gridActions = {
						changeState: function(state, index){
							$scope.changeState(state,{id: index});
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
					  }
					  if(page >= $scope.pagingOptions.totalPages){
						  page = $scope.pagingOptions.totalPages;
					  }
					  $scope.pagingOptions['pageButtons'] = range(page-2, $scope.pagingOptions.pageNav);
					  findData();
				  };
				  
				  $scope.pagingOptions = {
					  pageButtons: [1, 2, 3, 4, 5],
					  pageSize: 10,
					  currentPage: 1,
					  pageNav: 5,
					  totalPages: 5,
					  totalServerItems: 5
				  };	
			        
			      $scope.gridOptions = {
			        	options: {
				            enablePinning: true,
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
				                         var width = (90 / (_.pairs(elems).length)) + '%';
				                         Object.keys(elems).forEach(function(elem, index, test){
				                           var element=elems[elem];
				                         %>
				                         {
				                           field: '<%- elem%>',
				                           width: '<%- width%>',
				                           minWidth: 150,
				                           resizable: true,
				                           headerCellTemplate:"<div class='truncate'>{{'<%-element.ui.title%>'|translate}}</div>" +
				                              "<div class='ngSortButtonDown ng-hide' ng-show='col.showSortButtonDown()'></div>" +
				                              "<div class='ngSortButtonUp ng-hide' ng-show='col.showSortButtonUp()'></div>" +
				                           	  "<div ng-class='{ ngPinnedIcon: col.pinned, ngUnPinnedIcon: !col.pinned }' ng-click='togglePin(col)' ng-show='col.pinnable' class='ngPinnedIcon'></div>" +
				                           		"<div ng-show='col.resizable' class='ngHeaderGrip ng-scope' ng-click='col.gripClick($event)' ng-mousedown='col.gripOnMouseDown($event)'></div>"
				                         }, 
				                        <%});%>
				                        {
				                           <% var putState = 'main.' + parentStateName + '.PUT'; %>
					                       cellTemplate: "<div class='truncate'><a ng-click='gridOptions.actions.changeState(\"<%- putState%>\", row.getProperty(\"_id\"))'>{{'EDIT'|translate}}</a></div>",
					                       width: '*',
					                       minWidth: 150,
					                       resizable: false,
					                       headerCellTemplate:"<div class='truncate'>{{'EDIT'|translate}}</div>"
					                             
					                     }
				                        
				            ]
			        	}
			        }
			      
			      function findData(){
					  <%- parentStateName %>Services._find<%- parentStateName%>({}, $scope.pagingOptions.currentPage).then(function(response) {
			           	  	$scope.gridOptions.data = response.results;
			           	  	$scope.pagingOptions.totalServerItems = response.total;
			           	  	$scope.pagingOptions.totalPages = Math.ceil($scope.pagingOptions.totalServerItems / $scope.pagingOptions.pageSize);
							if($scope.pagingOptions.totalPages < $scope.pagingOptions.pageNav){
								$scope.pagingOptions.pageNav = $scope.pagingOptions.totalPages;
								$scope.pagingOptions.pageButtons = range($scope.pagingOptions.currentPage, $scope.pagingOptions.pageNav);
							}
			           });
				  }
			      
				  findData();
			  	
			  <% }else{%>
			  
				  $scope.directiveData = {};
				  <%
				  var directiveData = {};
				  var createDirectives = function(dataObject, elements){
				  	for(element in elements){
				  		if(elements[element].components){
				  			dataObject[element] = {
				  				type: elements[element].type
				  			};
				  			createDirectives(dataObject[element], elements[element].components.elements);
				  		}else{
				  			var elementData = elements[element];
				  			dataObject[element] = elementData;
				  			dataObject[element]['answer'] = '';
				  		}	
				  	}%>
				  	$scope.directiveData = <%= JSON.stringify(dataObject,null,2)%>;
				  <%}
				  createDirectives(directiveData, state.components.elements);
				  %>
				  
				  <% if(state.ui.title.toLowerCase() == '_put'){%>
					  	function mergeAnswers(dataObject, answers){
					  		if(Array.isArray(answers)){
					  			for(var i=0; i<answers.length; i++){
					  				mergeAnswers(dataObject, answers[i]);
					  			}
							  }else{
						  		for(key in dataObject){
						  			switch(dataObject[key].type) {
									    case 'array':
									    	mergeAnswers(dataObject[key], answers[key]);
									        break;
									    case 'map':
											returnAnswers(dataObject[key], answers[key]);
									        break;
									    default:
									    	dataObject[key]['answer'] = answers[key];
									}
						  		}
							  }
					  	}
				  		<%- parentStateName %>Services._get<%- parentStateName%>({}, id).then(function(response) {
				  			mergeAnswers($scope.directiveData, response);
				  		});                 
				  <%}%>
				  
				  var answers = {};
				  function returnAnswers(dataObject, answers){
					  if(Array.isArray(answers)){
					  		var arrayAnswers = {};
					  		for(key in dataObject){
					  			arrayAnswers[key] = dataObject[key].answer;
					  		}
					  		answers.push(arrayAnswers);
						  }else{
							for(key in dataObject){
								switch(dataObject[key].type) {
								    case 'array':
								    	answers[key] = [];
										returnAnswers(dataObject[key], answers[key]);
								        break;
								    case 'map':
								    	answers[key] = {};
										returnAnswers(dataObject[key], answers[key]);
								        break;
								    default:
								    	answers[key] = dataObject[key].answer;
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