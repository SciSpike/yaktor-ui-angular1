angular.module('<%=appname%>')
  .controller('<%-description.friendly%>Ctrl', ['$scope','$state','$stateParams','$location', 'RestService', 'SocketService', function ($scope,$state,$stateParams,$location, RestService, SocketService) {
    $scope.params={};
    $scope.refData={};
    $scope.go = function(hash){
      $location.path(hash);
    }
    
    $scope.activeNav = "_" + $state.current.name.toUpperCase();
    
    $scope.actionsList = {
        <%  Object.keys(description.elements).forEach(function(e, index, array){
          var element = description.elements[e];
          var actions = element.components.actions;
        %>
        '<%-e%>': [{
          action:"on<%-e%>",
          title: '<%-actions[e].ui.title%>'
        }],
        <%});%>
    };
    
    $scope.popoverData = {
    	test1: {
    		title: 'Home',
    		event: {
    			type: 'goState',
    			target: 'homecard_PaymentProcessor.init'
    		}
    	},
	    test2: {
    		title: 'Edit Payee',
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
      $scope.data['<%-e%>'] =$scope.data['<%-e%>']|| {};
      <% Object.keys(typeRefs).forEach(function(t){
        if(typeRefs[t]){
          typeRefs[t]=false;
         %>
        $scope.refData['<%-t%>'] = function(filter){return []};
      <% }}); %>
    <% }); %>
      
      $scope.goState = function(stateName,params,location){
        !$state.includes(stateName) && $state.go(stateName,params,{location:location});
      }  
      <% var actions = Object.keys(description.elements);
      if (actions.length == 1){%>
        $scope.goState('<%-description.friendly %>.<%-actions[0]%>')
      <%}%>
    
  
}]);