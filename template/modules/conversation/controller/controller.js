angular.module('conversation')
  .controller('<%-description.friendly%>Ctrl', ['$rootScope','$scope','$state','$stateParams','$location', 'RestService', 'SocketService', function ($rootScope,$scope,$state,$stateParams,$location, RestService, SocketService) {
    <% if (!description.url.match(/:state/)){%>
      $rootScope.title="<%- description.title %>"
    <%}%>
      
    $scope.params={};
    $scope.refData={};
    $scope.go = function(hash){
      $location.path(hash);
    }
    //used for ws nav; only evaled on parent;
    $scope.activeState = $state.current;
    //used for http nav; gives access to child state;
    $scope.$state = $state;
    
    var iconRef = {
        'FIND': 'glyphicon glyphicon-question-sign',
        'GET': 'glyphicon glyphicon-cloud-download',
        'POST': 'glyphicon glyphicon-send',
        'PUT': 'glyphicon glyphicon-cloud-upload',
        'DELETE': 'glyphicon glyphicon-remove-sign' 
    }
    
    $scope.getGlyph = {};
    
    $scope.setGlyph = function(string){
      $.each( iconRef, function( key, value ) {
        if (string.match(new RegExp(key))){
          $scope.getGlyph[string] = value;
        }
      });
    }  
    
    $scope.actionsList = {
        <%  Object.keys(description.elements).forEach(function(e, index, array){
          var element = description.elements[e];
          var actions = element.components.actions;
        %>
        '<%-e%>': [{
          action:function($scope){$scope.on<%-e%>()},
          title: '<%-actions[e].ui.title%>'
        }],
        <%});%>
    };
    <% if (!description.url.match(/:state/)){%>
    $scope.navList = [
        <%  
          var sMatch = new RegExp("^"+(description.title.replace(/([^.]*)\..*/,"$1\\.")));
          Object.keys(states).forEach(function(s){
            var state = states[s];
            if(state.title.match(sMatch) && state.proto.match(/ws:/) && !state.url.match(/:state/)) {
        %>
        { id:'<%-state.friendly%>',
          "class":"navicon",
          action:function($scope){
            $scope.goState('<%-state.friendly%>',null,{location:true})
            },
          title: '<%-state.title%>'
        },
        <%}});%>
    ];
    <%}%>
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