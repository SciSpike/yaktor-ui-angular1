//THIS REALLY ISN'T NEEDED
angular.module('<%=appname%>')
  .controller('<%-description.friendly%>Ctrl', ['$scope','$state','$stateParams','$location', 'RestService', 'SocketService', function ($scope,$state,$stateParams,$location, RestService, SocketService) {
    $scope.params={};
    $scope.refData={};
    $scope.go = function(hash){
      $location.path(hash);
    }
    
    $scope.popoverData = {
    	test1: {
    		title: 'test 1',
    		event: 'go',
    		target: 'init'
    	},
	    test2: {
    		title: 'test 2',
    		event: 'go',
    		target: 'init'
		},
	    test3: {
			title: 'test 3',
    		event: 'go',
    		target: 'init'
		},
	    test4: {
			title: 'test 4',
    		event: 'go',
    		target: 'init'
	    },
	    test5: {
	    	title: 'test 5',
    		event: 'go',
    		target: 'init'
	    }
    }
      
      $scope.data = $scope.data || {};
    <%  Object.keys(description.elements).forEach(function(e){
        var element = description.elements[e];
        var typeRefs = element.typeRefs;
        var elements = element.components.elements;
      %>
      $scope.data['<%-e%>'] = {};
      <% Object.keys(elements).forEach(function(v){
         var variable=elements[v];
        %>
        $scope.data['<%-e%>']['<%-v%>'] = null;
      <% }); %>
      <% Object.keys(typeRefs).forEach(function(t){
        if(typeRefs[t]){
          typeRefs[t]=false;
         %>
        $scope.refData['<%-t%>'] = function(filter){return []};
      <% }}); %>
    <% }); %>
      
      $scope.goState = function(stateName){
        !$state.includes(stateName) && $state.go(stateName,null,{location:false});
      }  
      <% var actions = Object.keys(description.elements);
      if (actions.length == 1){%>
        $scope.goState('<%-description.friendly %>.<%-actions[0]%>')
      <%}%>
    
  
}]);