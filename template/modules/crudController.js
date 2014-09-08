angular.module('<%- parentStateName %>')
  .controller('<%- parentStateName %><%- moduleName %>Controller',
		  ['$rootScope','$scope','$state','$stateParams','$location', '<%- parentStateName %>Services',
		   function ($rootScope,$scope,$state,$stateParams,$location, <%- parentStateName %>Services) {
			  
			  <% if(state.ui.title.toLowerCase() == 'find'){%>
			  
				  var id = $stateParams.id;
				  
				  function findData(data){
					  <%- parentStateName %>Services.find<%- parentStateName%>(data, id).then(function(response) {
			           	  	$scope.gridOptions.data = response.results;
			           });
				  }
				  if(id){
					  findData({});
				  }
				  
				  $scope.on_find = function(data) {
					  findData(data);
				  }
				  
				  $scope.currentPage=1; 
			        
			      $scope.gridOptions = {
			        	options: {
				            enablePinning: true,
				            enableColumnResize: true,
				            init:function(grid,$scope){
				              $scope.viewportStyle=function(){
				                return { };
				              }
				            },
				            columnDefs: [
				                         <% 
				                         var elems = state.components.elements;
				                         Object.keys(elems).forEach(function(elem, index, test){
				                           var width = 'auto';
				                           if(index == test.length-1){
				                             width = '*';
				                           }
				                           var element=elems[elem];
				                         %>
				                         {
				                           field: '<%-elem%>',
				                           width: '<%-width%>',
				                           minWidth: 150,
				                           resizable: true,
				                           headerCellTemplate:"<div class='truncate'>{{'<%-element.ui.title%>'|translate}}</div>" +
				                              "<div class='ngSortButtonDown ng-hide' ng-show='col.showSortButtonDown()'></div>" +
				                              "<div class='ngSortButtonUp ng-hide' ng-show='col.showSortButtonUp()'></div>" +
				                           	  "<div ng-class='{ ngPinnedIcon: col.pinned, ngUnPinnedIcon: !col.pinned }' ng-click='togglePin(col)' ng-show='col.pinnable' class='ngPinnedIcon'></div>" +
				                           		"<div ng-show='col.resizable' class='ngHeaderGrip ng-scope' ng-click='col.gripClick($event)' ng-mousedown='col.gripOnMouseDown($event)'></div>"
				                         }, 
				                        <%});%>
				            ]
			        	}
			        }
			  	
			  <% }else{%>
			  
				  $scope.directiveData = {};
				  <%
				  var createDirectives = function(elements){
				  	for(element in elements){
				  		if(elements[element].components){
				  			createDirectives(elements[element].components.elements);
				  		}else{
				  			var elementData = elements[element];%>
	$scope.directiveData['<%- element %>'] = <%= JSON.stringify(elementData,null,2)%>;
	$scope.directiveData['<%- element %>']['answer'] = '';
				  <%}}}
	
				  createDirectives(state.components.elements);%>
			  
				  $scope.submitForm = function(type){
					  var data = {};
					  for(key in $scope.directiveData){
						  data[key] = $scope.directiveData[key].answer;
					  }
					  <%- parentStateName %>Services.<%- state.ui.title.toLowerCase()%><%- parentStateName%>(data).then(function(response) {
			           	  	console.log(response);
			            });
				  }
				  
			  <%}%>
			  
		  }]);