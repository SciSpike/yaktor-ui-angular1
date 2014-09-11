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
				  
				  $scope.on_find = function(data) {
					  findData(data);
				  }
				  
				  $scope.currentPage=1; 
			        
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
			      
			      function findData(data){
					  <%- parentStateName %>Services._find<%- parentStateName%>(data, id).then(function(response) {
			           	  	$scope.gridOptions.data = response.results;
			           });
				  }
				  if(id){
					  findData({});
				  }
			  	
			  <% }else{%>
			  
			  	  <% if(state.ui.title.toLowerCase() == '_put'){%>
					  	<%- parentStateName %>Services._get<%- parentStateName%>({}, id).then(function(response) {
			           	  	console.log(response);
			           });
			  	  <%}%>
			  
				  $scope.directiveData = {};
				  <%
				  var directiveData = {};
				  var createDirectives = function(dataObject, elements){
				  	for(element in elements){
				  		if(elements[element].components){
				  			dataObject[element] = {};
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
				  
				  var answers = {};
				  function returnAnswers(dataObject, answers){
					  for(key in dataObject){
						  if(dataObject[key].answer){
							  answers[key] = dataObject[key].answer;
						  }else{
							  answers[key] = {};
							  returnAnswers(dataObject[key], answers[key]);
						  }
					  }
					  return answers;
				  }
				  
				  $scope.submitForm = function(type){
					  var data = returnAnswers($scope.directiveData, answers);
					  <%- parentStateName %>Services.<%- state.ui.title.toLowerCase()%><%- parentStateName%>(data).then(function(response) {
			           	  	console.log(response);
			           	  	$scope.changeState('main.<%- parentStateName %>.FIND', {id: 1});
			            });
				  }
			  <%}%>
			  
		  }]);